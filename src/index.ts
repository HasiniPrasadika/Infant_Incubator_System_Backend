import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import { PORT } from './secrets'
import rootRouter from './routes'
import { errorMiddleware } from "./middlewares/errors";
import { PrismaClient } from '@prisma/client';

const app:Express = express()

app.use(
  cors({
    origin: [
    'http://localhost:3000',
  ],
  credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
   
  })
);

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use('/api', rootRouter)

app.get("/", (req, res) => {
  res.status(200).send("Salon Wave backend");
});

let prismaClient: PrismaClient;

try {
  console.log("Initializing Prisma client...");
  prismaClient = new PrismaClient({
    log: ["query", "error", "info", "warn"],
  });
  
  // Test the connection immediately
  prismaClient.$connect()
    .then(() => {
      console.log("✓ Database connection successful!");
      return prismaClient.$queryRaw`SELECT 1 as test`;
    })
    .then((result) => {
      console.log("✓ Database query successful:", result);
    })
    .catch((error) => {
      console.error("✗ Database connection failed:");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      
      if (error.message.includes("access denied")) {
        console.error("Credentials appear to be incorrect.");
      } else if (error.message.includes("could not connect")) {
        console.error("Server might be unreachable or blocked by firewall.");
      } else if (error.message.includes("database") && error.message.includes("does not exist")) {
        console.error("The specified database does not exist.");
      }
    });
    
  console.log("Prisma client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
}

export { prismaClient };

app.use(errorMiddleware);

// cloudinary.v2.config({
//   cloud_name: CLOUDINARY_CLOUD_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
// });

app.listen(PORT, () => {
  console.log("App Working on port:", PORT);
});
import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import { PORT } from './secrets'
import rootRouter from './routes'
import { errorMiddleware } from "./middlewares/errors";
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { initializeSocketServer } from './socket/socketEmitter';
const { PythonShell } = require('python-shell');

const app:Express = express()
const server = createServer(app);

app.use(
  cors({
    origin: [
    'http://localhost:5173',
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
  res.status(200).send("FYP backend");
});



app.post('/api/classify', async (req: Request, res: Response) => {
  const { filePath } = req.body;
  console.log('Processing file:', filePath);

  const scriptName = 'classify.py';
  const scriptPath = path.resolve(__dirname, 'utils', scriptName);
  console.log('Python script path:', scriptPath);

  // Verify script exists
  if (!fs.existsSync(scriptPath)) {
    console.error('Python script not found at:', scriptPath);
    res.status(500).json({ 
      success: false, 
      error: 'Classification script not found' 
    });
    return;
  }

  const options = {
    mode: 'text',
    pythonPath: 'python',
    pythonOptions: ['-u'], // unbuffered output
    scriptPath: path.dirname(scriptPath),
    args: [filePath],
    timeout: 120000 // 120 second timeout
  };

  try {
    console.log('Starting Python classification with options:', options);
    
    
    const result = await new Promise<string>((resolve, reject) => {
      const pyshell = new PythonShell(scriptName, options);
      let output: string | undefined;
      let errorOutput = '';

      pyshell.on('message', function (message: string) {
        console.log('Python output:', message);
        output = message;
      });

      pyshell.on('stderr', function (stderr: string) {
        console.error('Python stderr:', stderr);
        errorOutput += stderr + '\n';
      });

      pyshell.end(function (err: Error | null, code: number, signal: string) {
        if (err) {
          console.error('Python execution error:', err);
          reject(new Error(`Python execution failed: ${err.message}\n\nError output:\n${errorOutput}`));
        } else if (output === 'error_processing') {
          reject(new Error(`Classification failed: Feature mismatch or processing error\n\nError output:\n${errorOutput}`));
        } else {
          console.log('Python finished with code:', code);
          resolve(output ?? '');
        }
      });
    });

    if (!result) {
      throw new Error('No classification result received');
    }

    console.log('Classification completed with result:', result);

    res.json({ 
      success: true, 
      cryStatus: result,
      babyId: '5'
    });
  } catch (error: any) {
    console.error('Classification error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Classification failed',
      details: error.stack
    });
  }
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

// Initialize Socket.IO server
initializeSocketServer(server);

server.listen(PORT, () => {
  console.log("App Working on port:", PORT);
  console.log("Socket.IO server initialized");
});

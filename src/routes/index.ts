import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./users";
import babyRoutes from "./baby";

const rootRouter:Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/user', userRoutes)
rootRouter.use('/baby', babyRoutes)

export default rootRouter


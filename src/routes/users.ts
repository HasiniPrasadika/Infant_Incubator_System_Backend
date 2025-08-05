import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import { createUser, getAllUsers } from '../controllers/users'
import adminMiddleware from '../middlewares/admin'

const userRoutes:Router = Router()

userRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createUser))
userRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(getAllUsers))

export default userRoutes
import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import { createUser, generateInviteLink, getAllUsers, registerParent } from '../controllers/users'
import adminMiddleware from '../middlewares/admin'

const userRoutes:Router = Router()

userRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createUser))
userRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(getAllUsers))
userRoutes.post('/invite', [authMiddleware, adminMiddleware], errorHandler(generateInviteLink));
userRoutes.post('/register-parent', errorHandler(registerParent))

export default userRoutes
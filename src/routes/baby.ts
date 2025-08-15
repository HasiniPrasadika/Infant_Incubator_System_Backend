import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';
import { errorHandler } from '../error-handler';
import {
  createBaby,
  updateBaby,
  deleteBaby,
  getBabyById,
  getAllBabies,
} from '../controllers/baby';

const babyRoutes: Router = Router();

babyRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createBaby));
babyRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateBaby));
babyRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteBaby));
babyRoutes.get('/:id', [authMiddleware], errorHandler(getBabyById));
babyRoutes.get('/', [authMiddleware], errorHandler(getAllBabies));

export default babyRoutes;

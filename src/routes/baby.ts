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
import { getTemperatureHistory, saveTemperature } from '../controllers/temperature';
import { getHeartRateHistory, saveHeartRate } from '../controllers/heartrate';
import { getSpo2History, saveSpo2 } from '../controllers/spo2';
import { getHumidityHistory, saveHumidity } from '../controllers/humidity';

const babyRoutes: Router = Router();

babyRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createBaby));
babyRoutes.put('/:id', errorHandler(updateBaby));
babyRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteBaby));
babyRoutes.get('/:id', errorHandler(getBabyById));
babyRoutes.get('/', errorHandler(getAllBabies));

babyRoutes.post('/save-temp', errorHandler(saveTemperature));
babyRoutes.get('/temp/:babyId/:month/:year', errorHandler(getTemperatureHistory));

babyRoutes.post('/save-heart-rate', errorHandler(saveHeartRate));
babyRoutes.get('/heart-rate/:babyId/:month/:year', errorHandler(getHeartRateHistory));

babyRoutes.post('/save-spo2', errorHandler(saveSpo2));
babyRoutes.get('/spo2/:babyId/:month/:year', errorHandler(getSpo2History));

babyRoutes.post('/save-humidity', errorHandler(saveHumidity));
babyRoutes.get('/humidity/:babyId/:month/:year', errorHandler(getHumidityHistory));

export default babyRoutes;

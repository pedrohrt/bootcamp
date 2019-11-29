import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';


import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions',  SessionController.store);

routes.use(authMiddleware);

routes.post('/students',  StudentController.store);
routes.put('/students/:index',  StudentController.update);

routes.post('/plans',  PlanController.store);
routes.put('/plans/:index',  PlanController.update);
routes.get('/plans',  PlanController.index);
routes.delete('/plans/:index',  PlanController.delete);

routes.post('/enrollment',  EnrollmentController.store);








export default routes;

import { Router } from 'express';
import HttpException from '../exceptions/httpException';
import userRouter from './userRouter';

const mainRouter = Router();

mainRouter.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

mainRouter.use('/user', userRouter);

// Pass unrecognized routes to error handler with 404
mainRouter.get('*', (req, res, next) => {
  next(new HttpException(404, 'Not found.'));
});

export default mainRouter;

import { Router } from 'express';
import HttpException from '../exceptions/httpException';

const mainRouter = Router();

mainRouter.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

// Pass unrecognized routes to error handler with 404
mainRouter.get('*', (req, res, next) => {
  next(new HttpException(404, 'Not found'));
});

export default mainRouter;

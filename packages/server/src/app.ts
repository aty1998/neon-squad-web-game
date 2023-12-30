import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import mainRouter from './routers/mainRouter';
import HttpException from './exceptions/httpException';

const app = express();

app.use(express.json());

// Logger
app.use(morgan('tiny'));

// API routes
app.use(mainRouter);

// Simple error handler
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong.';
  res.status(status).json({ status, message });
});

export default app;

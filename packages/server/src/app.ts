import express, { NextFunction, Request, Response } from 'express';
import HttpException from './exceptions/httpException';

import mainRouter from './routers/mainRouter';

const app = express();

app.use(express.json());

// API routes
app.use(mainRouter);

// Simple error handler
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status);
  res.json({ status, message });
});

export default app;

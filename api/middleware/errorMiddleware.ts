import type { Request, Response, NextFunction } from 'express';
import { AppConfig } from '../config/index.js';

export const errorHandler = (err: TypeError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: AppConfig.NODE_ENV === 'production' ? null : err.stack,
  });
};

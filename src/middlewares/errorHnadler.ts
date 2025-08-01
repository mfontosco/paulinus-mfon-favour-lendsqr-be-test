import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(status).json({
    status: false,
    message,
  });
}

import { Request, Response, NextFunction } from 'express';
import type { AppError } from '@midnight-survey/shared-types';
import { v4 as uuidv4 } from 'uuid';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const requestId = uuidv4();
  const isAppError = 'code' in err && 'statusCode' in err;

  if (isAppError) {
    const appErr = err as unknown as AppError;
    res.status(appErr.statusCode).json({
      success: false,
      error: {
        code: appErr.code,
        message: appErr.message,
        details: appErr.details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
        version: '1.0.0',
      },
    });
    return;
  }

  console.error(`[${requestId}] Unhandled error:`, err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An internal error occurred' : err.message,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      version: '1.0.0',
    },
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
      version: '1.0.0',
    },
  });
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: { code: 'AUTHENTICATION_ERROR', message: 'No token provided' } });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ success: false, error: { code: 'AUTHENTICATION_ERROR', message: 'Invalid token' } });
  }
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; role: string };
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    } catch {
      // ignore invalid tokens for optional auth
    }
  }
  next();
}

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.userRole !== role && req.userRole !== 'admin') {
      res.status(403).json({ success: false, error: { code: 'AUTHORIZATION_ERROR', message: 'Insufficient permissions' } });
      return;
    }
    next();
  };
}

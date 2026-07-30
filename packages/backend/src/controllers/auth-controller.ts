import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth-service';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register(email, password, name);
      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const user = await authService.getById(userId);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = authService.refreshToken(refreshToken);
      res.json({ success: true, data: tokens });
    } catch (err) { next(err); }
  }
}

export const authController = new AuthController();

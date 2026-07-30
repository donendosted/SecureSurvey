import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { User, AuthTokens, UserRole } from '@midnight-survey/shared-types';
import { AuthenticationError, ConflictError } from '@midnight-survey/shared-types';
import { config } from '../config';

const users = new Map<string, User & { password: string }>();

export class AuthService {
  async register(email: string, password: string, name?: string): Promise<{ user: User; tokens: AuthTokens }> {
    const existing = Array.from(users.values()).find(u => u.email === email);
    if (existing) throw new ConflictError('Email already registered');

    const id = uuidv4();
    const now = new Date().toISOString();
    const user: User & { password: string } = {
      id, email, name, password,
      role: 'respondent' as UserRole,
      emailVerified: false,
      createdAt: now, updatedAt: now,
      preferences: { language: 'en', timezone: 'UTC', emailNotifications: true, theme: 'system' },
    };
    users.set(id, user);

    const tokens = this.generateTokens(id, user.role);
    const { password: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user || user.password !== password) throw new AuthenticationError('Invalid email or password');

    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    users.set(user.id, user);

    const tokens = this.generateTokens(user.id, user.role);
    const { password: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async getById(id: string): Promise<User> {
    const user = users.get(id);
    if (!user) throw new AuthenticationError('User not found');
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  refreshToken(token: string): AuthTokens {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; role: string };
      return this.generateTokens(decoded.userId, decoded.role);
    } catch {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  private generateTokens(userId: string, role: string): AuthTokens {
    const accessToken = jwt.sign({ userId, role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    const refreshToken = jwt.sign({ userId, role, type: 'refresh' }, config.jwt.secret, { expiresIn: config.jwt.refreshExpiresIn });
    return { accessToken, refreshToken, expiresIn: 86400, tokenType: 'Bearer' };
  }
}

export const authService = new AuthService();

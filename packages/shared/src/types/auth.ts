export enum UserRole {
  ADMIN = 'admin',
  CREATOR = 'creator',
  ANALYST = 'analyst',
  VIEWER = 'viewer',
  RESPONDENT = 'respondent',
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  preferences: {
    language: string;
    timezone: string;
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, AuthTokens } from '@midnight-survey/shared-types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, tokens: null, isLoading: false });

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message ?? 'Login failed');
      setState({ user: data.data.user, tokens: data.data.tokens, isLoading: false });
      localStorage.setItem('tokens', JSON.stringify(data.data.tokens));
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message ?? 'Registration failed');
      setState({ user: data.data.user, tokens: data.data.tokens, isLoading: false });
      localStorage.setItem('tokens', JSON.stringify(data.data.tokens));
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, tokens: null, isLoading: false });
    localStorage.removeItem('tokens');
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, isAuthenticated: !!state.user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

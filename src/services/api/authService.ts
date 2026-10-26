import { httpClient } from './httpClient.js';
import { env } from '../../config/env.js';
import type {
  AuthUser,
  LoginResponse,
  MeResponse,
  MessageResponse,
  RefreshResponse,
} from '../../types/auth.js';

const MOCK_SUPER_ADMIN_USER: AuthUser = {
  id: 'usr-superadmin-01',
  email: 'admin@autocatalogo.com.br',
  name: 'Super Admin (Ops)',
  avatarUrl: null,
  isSuperAdmin: true,
  mfaEnabled: true,
  createdAt: '2025-01-01T00:00:00Z',
};

let mockSessionUser: AuthUser | null = null;

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      return await httpClient.post<LoginResponse>(
        '/auth/login',
        { email, password },
        { skipAuthRefresh: true },
      );
    } catch (error: any) {
      if (env.enableMockFallback) {
        mockSessionUser = {
          ...MOCK_SUPER_ADMIN_USER,
          email,
        };
        return {
          accessToken: `mock_jwt_superadmin_${Date.now()}`,
          expiresIn: 3600,
          tokenType: 'Bearer',
          user: mockSessionUser,
        };
      }
      throw error;
    }
  },

  async refresh(): Promise<RefreshResponse> {
    try {
      return await httpClient.post<RefreshResponse>(
        '/auth/refresh',
        undefined,
        { skipAuthRefresh: true },
      );
    } catch (error: any) {
      if (env.enableMockFallback && mockSessionUser) {
        return {
          accessToken: `mock_jwt_superadmin_${Date.now()}`,
          expiresIn: 3600,
          tokenType: 'Bearer',
        };
      }
      throw error;
    }
  },

  async logout(): Promise<MessageResponse> {
    mockSessionUser = null;
    try {
      return await httpClient.post<MessageResponse>('/auth/logout');
    } catch (error: any) {
      if (env.enableMockFallback) {
        return { message: 'Sessão encerrada com sucesso' };
      }
      throw error;
    }
  },

  async getMe(): Promise<MeResponse> {
    try {
      return await httpClient.get<MeResponse>('/auth/me');
    } catch (error: any) {
      if (env.enableMockFallback && mockSessionUser) {
        return { user: mockSessionUser };
      }
      throw error;
    }
  },
};

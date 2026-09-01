import { httpClient } from './httpClient.js';
import type {
  LoginResponse,
  MeResponse,
  MessageResponse,
  RefreshResponse,
} from '../../types/auth.js';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/auth/login', { email, password }, { skipAuthRefresh: true });
  },

  async refresh(): Promise<RefreshResponse> {
    return httpClient.post<RefreshResponse>('/auth/refresh', undefined, { skipAuthRefresh: true });
  },

  async logout(): Promise<MessageResponse> {
    return httpClient.post<MessageResponse>('/auth/logout');
  },

  async getMe(): Promise<MeResponse> {
    return httpClient.get<MeResponse>('/auth/me');
  },
};

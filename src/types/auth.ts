export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isSuperAdmin: boolean;
  mfaEnabled?: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface MeResponse {
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

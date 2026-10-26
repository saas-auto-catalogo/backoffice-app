import { httpClient } from './httpClient.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../types/api.js';
import type {
  ImpersonatePayload,
  ImpersonationResponse,
} from '../../types/impersonation.js';

export const impersonationService = {
  async startImpersonation(
    targetWorkspaceId: string,
    reason: string,
  ): Promise<ImpersonationResponse> {
    const trimmedReason = reason?.trim() || '';

    if (trimmedReason.length < 10) {
      throw new Error('A justificativa deve conter no mínimo 10 caracteres.');
    }

    const payload: ImpersonatePayload = {
      targetWorkspaceId,
      reason: trimmedReason,
    };

    try {
      const response = await httpClient.post<ImpersonationResponse>(
        '/auth/impersonate',
        payload,
      );
      return response;
    } catch (error: any) {
      // Propaga erros de autorização (ex. 403 MFA obrigatório) ou validação
      if (error instanceof ApiError && (error.statusCode === 403 || error.statusCode === 400 || error.statusCode === 404)) {
        throw error;
      }

      // Se mock fallback estiver habilitado para desenvolvimento local sem backend ativo
      if (env.enableMockFallback) {
        return {
          accessToken: `mock_imp_jwt_${targetWorkspaceId}_${Date.now()}`,
          expiresIn: 3600,
          tokenType: 'Bearer',
          impersonation: {
            targetWorkspaceId,
            targetWorkspaceName: `Workspace (${targetWorkspaceId})`,
            impersonatedByUserId: 'super-admin-local',
            reason: trimmedReason,
          },
        };
      }

      throw error;
    }
  },

  async endImpersonation(): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>(
        '/auth/impersonate/end',
      );
      return response;
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 401) {
        throw error;
      }

      if (env.enableMockFallback) {
        return {
          message: 'Sessão de impersonation encerrada com sucesso',
        };
      }

      throw error;
    }
  },
};

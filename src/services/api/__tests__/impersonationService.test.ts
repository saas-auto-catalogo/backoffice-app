import { describe, it, expect, vi, beforeEach } from 'vitest';
import { impersonationService } from '../impersonationService.js';
import { httpClient } from '../httpClient.js';
import { ApiError } from '../../../types/api.js';

describe('impersonationService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve chamar POST /auth/impersonate com targetWorkspaceId e reason válidos', async () => {
    const mockResponse = {
      accessToken: 'jwt_mock_token_123',
      expiresIn: 3600,
      tokenType: 'Bearer' as const,
      impersonation: {
        targetWorkspaceId: 'tenant-123',
        targetWorkspaceName: 'Auto Concessionária',
        impersonatedByUserId: 'admin-1',
        reason: 'Auditoria e diagnóstico de sincronização de catálogo',
      },
    };

    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce(mockResponse);

    const result = await impersonationService.startImpersonation(
      'tenant-123',
      'Auditoria e diagnóstico de sincronização de catálogo',
    );

    expect(postSpy).toHaveBeenCalledWith('/auth/impersonate', {
      targetWorkspaceId: 'tenant-123',
      reason: 'Auditoria e diagnóstico de sincronização de catálogo',
    });
    expect(result.accessToken).toBe('jwt_mock_token_123');
    expect(result.impersonation.targetWorkspaceId).toBe('tenant-123');
  });

  it('deve rejeitar se o motivo tiver menos de 10 caracteres', async () => {
    await expect(
      impersonationService.startImpersonation('tenant-123', 'Curto'),
    ).rejects.toThrow('A justificativa deve conter no mínimo 10 caracteres.');
  });

  it('deve propagar ApiError de MFA obrigatório (403)', async () => {
    vi.spyOn(httpClient, 'post').mockRejectedValueOnce(
      new ApiError('MFA_REQUIRED: Autenticação de dois fatores obrigatória', 403, 'MFA_REQUIRED'),
    );

    await expect(
      impersonationService.startImpersonation(
        'tenant-123',
        'Auditoria e diagnóstico de sincronização de catálogo',
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
      code: 'MFA_REQUIRED',
    });
  });

  it('deve chamar POST /auth/impersonate/end ao encerrar impersonation', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      message: 'Sessão de impersonation encerrada com sucesso',
    });

    const result = await impersonationService.endImpersonation();

    expect(postSpy).toHaveBeenCalledWith('/auth/impersonate/end');
    expect(result.message).toBe('Sessão de impersonation encerrada com sucesso');
  });
});

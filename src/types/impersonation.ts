export interface ImpersonatePayload {
  targetWorkspaceId: string;
  reason: string;
}

export interface ImpersonationSessionData {
  targetWorkspaceId: string;
  targetWorkspaceName?: string;
  impersonatedByUserId: string;
  reason: string;
}

export interface ImpersonationResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  impersonation: ImpersonationSessionData;
}

export interface ActiveImpersonationSession {
  token: string;
  tenantId: string;
  tenantName: string;
  tenantCnpj: string;
  tenantPlan: string;
  reason: string;
  startedAt: string;
  expiresAt: string;
}

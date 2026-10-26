export type TenantPlan = 'ENTERPRISE' | 'PRO' | 'SCALE' | 'STARTER';
export type TenantStatus = 'ACTIVE' | 'WARNING' | 'SYNC_FAILED' | 'SUSPENDED' | 'ONBOARDING';

export interface Tenant {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  city: string;
  state: string;
  plan: TenantPlan;
  mrr: number;
  dmsProvider: string;
  vehiclesCount: number;
  metaHealthScore: number;
  status: TenantStatus;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  feedToken: string;
  createdAt: string;
  lastSyncAt: string;
}

export type WorkspaceMemberRole = 'OWNER' | 'MANAGER' | 'VIEWER';
export type WorkspaceMemberStatus = 'ACTIVE' | 'PENDING' | 'DISABLED';

export interface WorkspaceMember {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: WorkspaceMemberRole;
  status: WorkspaceMemberStatus;
  joinedAt: string;
  lastActiveAt?: string;
}

export interface InviteMemberPayload {
  email: string;
  role: WorkspaceMemberRole;
  name?: string;
}

export type AuditAction =
  | 'IMPERSONATE_START'
  | 'IMPERSONATE_END'
  | 'FORCE_GLOBAL_SYNC'
  | 'TENANT_STATUS_CHANGE'
  | 'PLAN_UPGRADE'
  | 'FEED_RESET'
  | 'MEMBER_INVITE'
  | 'MEMBER_ROLE_CHANGE'
  | 'MEMBER_REMOVE';

export interface AuditLog {
  id: string;
  adminEmail: string;
  adminName: string;
  action: AuditAction;
  targetTenantId?: string;
  targetTenantName?: string;
  targetMemberId?: string;
  targetMemberEmail?: string;
  reason: string;
  ipAddress: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface SaaSOverviewMetrics {
  mrrTotal: number;
  mrrGrowthMoM: number;
  activeTenantsCount: number;
  uptimePercentage: number;
  totalVehiclesIndexed: number;
  xmlSuccessRate: number;
  avgLatencyMs: number;
  workersActive: number;
  redisQueuePending: number;
}

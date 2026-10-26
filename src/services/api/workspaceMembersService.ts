import { httpClient } from './httpClient.js';
import { auditLogService } from './auditLogService.js';
import { FALLBACK_TENANTS } from './tenantService.js';
import { ApiError } from '../../types/api.js';
import {
  WorkspaceMember,
  WorkspaceMemberRole,
  InviteMemberPayload,
  AuditLog,
} from '../../types/backoffice.js';

const ADMIN_EMAIL = 'fabio.oliveira@drivesync.me';
const ADMIN_NAME = 'Fabio Oliveira (Super Admin)';
const ADMIN_IP = '189.40.122.95 (São Paulo / BR)';

function relDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('pt-BR');
}

function formatDate(iso: string | undefined, daysAgo: number): string {
  if (iso) {
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR');
  }
  return relDate(daysAgo);
}

const GUEST_TEMPLATES: Array<{
  name: string;
  slug: string;
  role: WorkspaceMemberRole;
  status: WorkspaceMember['status'];
  joinedDaysAgo: number;
}> = [
  { name: 'Ana Beatriz Rocha', slug: 'ana.beatriz', role: 'MANAGER', status: 'ACTIVE', joinedDaysAgo: 14 },
  { name: 'Bruno Carvalho', slug: 'bruno.carvalho', role: 'VIEWER', status: 'ACTIVE', joinedDaysAgo: 35 },
  { name: 'Camila Duarte', slug: 'camila.duarte', role: 'VIEWER', status: 'PENDING', joinedDaysAgo: 1 },
  { name: 'Diego Ferreira', slug: 'diego.ferreira', role: 'VIEWER', status: 'DISABLED', joinedDaysAgo: 60 },
];

const FALLBACK_MEMBERS: Record<string, WorkspaceMember[]> = FALLBACK_TENANTS.reduce(
  (acc, tenant, tenantIndex) => {
    const domain = tenant.primaryContact.email.split('@')[1] ?? 'drivesync.me';

    const owner: WorkspaceMember = {
      id: `wm-${tenant.id}-owner`,
      userId: `usr-${tenant.id}-owner`,
      name: tenant.primaryContact.name,
      email: tenant.primaryContact.email,
      role: 'OWNER',
      status: 'ACTIVE',
      joinedAt: formatDate(tenant.createdAt, 0),
      lastActiveAt: 'Hoje às 20:45',
    };

    const guests: WorkspaceMember[] = GUEST_TEMPLATES.map((g, i) => ({
      id: `wm-${tenant.id}-guest-${i}`,
      userId: `usr-${tenant.id}-guest-${i}`,
      name: g.name,
      email: `${g.slug}@${domain}`,
      role: g.role,
      status: g.status,
      joinedAt: relDate(g.joinedDaysAgo),
      lastActiveAt: g.status === 'ACTIVE' ? relDate(Math.max(tenantIndex % 3, 1)) : undefined,
    }));

    acc[tenant.id] = [owner, ...guests];
    return acc;
  },
  {} as Record<string, WorkspaceMember[]>
);

const IN_MEMORY_MEMBER_LOGS: AuditLog[] = FALLBACK_TENANTS.flatMap((tenant, tenantIndex) => {
  const members = FALLBACK_MEMBERS[tenant.id] ?? [];
  const pending = members.find((m) => m.status === 'PENDING');
  const manager = members.find((m) => m.role === 'MANAGER');
  const logs: AuditLog[] = [];

  if (pending) {
    logs.push({
      id: `mlog-${tenant.id}-invite`,
      adminEmail: ADMIN_EMAIL,
      adminName: ADMIN_NAME,
      action: 'MEMBER_INVITE',
      targetTenantId: tenant.id,
      targetTenantName: tenant.tradeName,
      targetMemberId: pending.id,
      targetMemberEmail: pending.email,
      reason: `Convite enviado para ${pending.email} com papel VIEWER.`,
      ipAddress: ADMIN_IP,
      createdAt: relDate(Math.max(tenantIndex % 7, 1)),
    });
  }

  if (manager) {
    logs.push({
      id: `mlog-${tenant.id}-role`,
      adminEmail: ADMIN_EMAIL,
      adminName: ADMIN_NAME,
      action: 'MEMBER_ROLE_CHANGE',
      targetTenantId: tenant.id,
      targetTenantName: tenant.tradeName,
      targetMemberId: manager.id,
      targetMemberEmail: manager.email,
      reason: `Papel de ${manager.email} promovido para MANAGER.`,
      ipAddress: ADMIN_IP,
      createdAt: relDate(Math.max(tenantIndex % 3 + 3, 3)),
    });
  }

  return logs;
});

async function recordMemberAudit(
  action: 'MEMBER_INVITE' | 'MEMBER_ROLE_CHANGE' | 'MEMBER_REMOVE',
  workspaceId: string,
  member: WorkspaceMember,
  reason: string
): Promise<void> {
  const tenant = FALLBACK_TENANTS.find((t) => t.id === workspaceId);
  const log = await auditLogService.logAction({
    adminEmail: ADMIN_EMAIL,
    adminName: ADMIN_NAME,
    action,
    targetTenantId: workspaceId,
    targetTenantName: tenant?.tradeName ?? workspaceId,
    targetMemberId: member.id,
    targetMemberEmail: member.email,
    reason,
    ipAddress: ADMIN_IP,
    metadata: { workspaceId, memberId: member.id, memberEmail: member.email },
  });

  IN_MEMORY_MEMBER_LOGS.unshift(log);
}

function countOwners(members: WorkspaceMember[]): number {
  return members.filter((m) => m.role === 'OWNER' && m.status === 'ACTIVE').length;
}

export const workspaceMembersService = {
  async listMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    try {
      const res = await httpClient.get<{ items: WorkspaceMember[] }>(
        `/admin/workspaces/${workspaceId}/members`,
        { timeout: 5000 }
      );
      if (res.items) return res.items;
      return res as any;
    } catch {
      return [...(FALLBACK_MEMBERS[workspaceId] ?? [])];
    }
  },

  async inviteMember(workspaceId: string, payload: InviteMemberPayload): Promise<WorkspaceMember> {
    const member: WorkspaceMember = {
      id: `wm-${workspaceId}-${Date.now()}`,
      name: payload.name?.trim() || payload.email.split('@')[0],
      email: payload.email,
      role: payload.role,
      status: 'PENDING',
      joinedAt: relDate(0),
    };

    try {
      const res = await httpClient.post<WorkspaceMember>(
        `/admin/workspaces/${workspaceId}/members/invite`,
        payload,
        { timeout: 5000 }
      );
      await recordMemberAudit(
        'MEMBER_INVITE',
        workspaceId,
        res ?? member,
        `Convite enviado para ${(res ?? member).email} com papel ${(res ?? member).role}.`
      );
      return res ?? member;
    } catch {
      FALLBACK_MEMBERS[workspaceId] = [member, ...(FALLBACK_MEMBERS[workspaceId] ?? [])];
      await recordMemberAudit(
        'MEMBER_INVITE',
        workspaceId,
        member,
        `Convite enviado para ${member.email} com papel ${member.role}.`
      );
      return member;
    }
  },

  async updateMemberRole(
    workspaceId: string,
    memberId: string,
    role: WorkspaceMemberRole
  ): Promise<WorkspaceMember> {
    const members = FALLBACK_MEMBERS[workspaceId] ?? [];
    const current = members.find((m) => m.id === memberId);

    try {
      await httpClient.patch(`/admin/workspaces/${workspaceId}/members/${memberId}`, { role }, { timeout: 5000 });
      if (current) current.role = role;

      const updated: WorkspaceMember = current ?? {
        id: memberId,
        name: 'Membro do Workspace',
        email: memberId,
        role,
        status: 'ACTIVE',
        joinedAt: relDate(0),
      };

      await recordMemberAudit(
        'MEMBER_ROLE_CHANGE',
        workspaceId,
        updated,
        `Papel de ${updated.email} alterado para ${role}.`
      );

      return updated;
    } catch {
      if (current) {
        current.role = role;
        await recordMemberAudit(
          'MEMBER_ROLE_CHANGE',
          workspaceId,
          current,
          `Papel de ${current.email} alterado para ${role}.`
        );
        return current;
      }
      throw new ApiError('Membro não encontrado no workspace.', 404, 'MEMBER_NOT_FOUND');
    }
  },

  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/workspaces/${workspaceId}/members/${memberId}`, { timeout: 5000 });
    } catch {
      const members = FALLBACK_MEMBERS[workspaceId] ?? [];
      const member = members.find((m) => m.id === memberId);
      if (!member) return;

      if (member.role === 'OWNER' && countOwners(members) <= 1) {
        throw new ApiError(
          'Não é possível remover o último OWNER do workspace. Promova outro membro antes.',
          409,
          'LAST_OWNER'
        );
      }

      members.splice(members.indexOf(member), 1);
      await recordMemberAudit(
        'MEMBER_REMOVE',
        workspaceId,
        member,
        `Membro ${member.email} removido do workspace.`
      );
    }
  },

  async listMemberAuditLogs(workspaceId: string, memberId: string): Promise<AuditLog[]> {
    try {
      const res = await httpClient.get<{ items: AuditLog[] }>(
        `/admin/workspaces/${workspaceId}/audit-logs`,
        { params: { memberId }, timeout: 5000 }
      );
      if (res.items) return res.items;
      return res as any;
    } catch {
      return IN_MEMORY_MEMBER_LOGS.filter(
        (l) => l.targetTenantId === workspaceId && l.targetMemberId === memberId
      );
    }
  },
};
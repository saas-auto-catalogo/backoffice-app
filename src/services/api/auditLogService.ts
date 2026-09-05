import { httpClient } from './httpClient.js';
import { AuditLog } from '../../types/backoffice.js';

const IN_MEMORY_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    adminEmail: 'fabio.oliveira@drivesync.me',
    adminName: 'Fabio Oliveira (Super Admin)',
    action: 'FORCE_GLOBAL_SYNC',
    reason: 'Rotina de validação matinal de pipelines DMS.',
    ipAddress: '189.40.122.95 (SP)',
    createdAt: 'Hoje às 08:30',
  },
  {
    id: 'log-002',
    adminEmail: 'suporte@drivesync.me',
    adminName: 'Lucas Matos (Suporte N2)',
    action: 'IMPERSONATE_START',
    targetTenantId: 'tenant-localiza-cwb-003',
    targetTenantName: 'Localiza Prime (Curitiba)',
    reason: 'Ajuste de mapeamento da tag de fotos Sisvag.',
    ipAddress: '177.18.200.14 (PR)',
    createdAt: 'Hoje às 14:12',
  },
  {
    id: 'log-003',
    adminEmail: 'suporte@drivesync.me',
    adminName: 'Lucas Matos (Suporte N2)',
    action: 'IMPERSONATE_END',
    targetTenantId: 'tenant-localiza-cwb-003',
    targetTenantName: 'Localiza Prime (Curitiba)',
    reason: 'Conclusão do teste e validação do feed.',
    ipAddress: '177.18.200.14 (PR)',
    createdAt: 'Hoje às 14:28',
  },
  {
    id: 'log-004',
    adminEmail: 'fabio.oliveira@drivesync.me',
    adminName: 'Fabio Oliveira (Super Admin)',
    action: 'PLAN_UPGRADE',
    targetTenantId: 'tenant-itavema-rio-005',
    targetTenantName: 'Grupo Itavema (Barra)',
    reason: 'Upgrade comercial para plano Scale (640 veículos).',
    ipAddress: '189.40.122.95 (SP)',
    createdAt: 'Ontem às 17:45',
  },
];

export const auditLogService = {
  async listLogs(): Promise<AuditLog[]> {
    try {
      const res = await httpClient.get<{ items: AuditLog[] }>('/admin/audit-logs', { timeout: 4000 });
      if (res.items) return res.items;
      return res as any;
    } catch {
      return [...IN_MEMORY_LOGS];
    }
  },

  async logAction(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...data,
      id: `log-${Date.now()}`,
      createdAt: 'Agora mesmo',
    };

    IN_MEMORY_LOGS.unshift(newLog);

    try {
      await httpClient.post('/admin/audit-logs', newLog, { timeout: 3000 });
    } catch {
      // Ignora erro em mock mode
    }

    return newLog;
  },
};

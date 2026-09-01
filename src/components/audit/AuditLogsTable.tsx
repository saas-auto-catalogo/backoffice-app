import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { ScrollText, ShieldAlert, KeyRound, RefreshCw, Layers } from 'lucide-react';
import { AuditLog } from '../../types/backoffice.js';

export interface AuditLogsTableProps {
  logs: AuditLog[];
  onRefresh?: () => void;
  loading?: boolean;
}

export function AuditLogsTable({ logs, onRefresh, loading = false }: AuditLogsTableProps) {
  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'IMPERSONATE_START':
        return (
          <Badge variant="amber" size="sm" icon={<KeyRound className="w-3 h-3 text-amber-600" />}>
            Início Impersonation
          </Badge>
        );
      case 'IMPERSONATE_END':
        return (
          <Badge variant="neutral" size="sm" icon={<ShieldAlert className="w-3 h-3 text-slate-500" />}>
            Fim Impersonation
          </Badge>
        );
      case 'FORCE_GLOBAL_SYNC':
        return (
          <Badge variant="syncing" size="sm" icon={<RefreshCw className="w-3 h-3 text-brand-primary" />}>
            Sync Global Forçado
          </Badge>
        );
      case 'PLAN_UPGRADE':
        return (
          <Badge variant="available" size="sm" icon={<Layers className="w-3 h-3 text-brand-accent" />}>
            Upgrade de Plano
          </Badge>
        );
      default:
        return <Badge variant="neutral" size="sm">{action}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center justify-between py-4 bg-surface-muted/30">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-brand-primary" />
            <h3 className="text-sm font-bold text-typography-heading">
              Trilha de Auditoria & Segurança (Audit Trail)
            </h3>
            <span className="bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs px-2 py-0.5 rounded-full">
              {logs.length} Registros Gravados
            </span>
          </div>
          <p className="text-xs text-typography-muted mt-0.5">
            Log imutável de todas as ações sensíveis realizadas por administradores da plataforma.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Logs</span>
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted/60 border-b border-surface-border text-[11px] font-bold text-typography-muted uppercase tracking-wider">
                <th className="py-3 px-4">Administrador</th>
                <th className="py-3 px-4">Tipo de Ação</th>
                <th className="py-3 px-4">Tenant / Concessionária Alvo</th>
                <th className="py-3 px-4">Motivo / Justificativa</th>
                <th className="py-3 px-4">IP de Origem</th>
                <th className="py-3 px-4 text-right">Data / Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-typography-heading">{log.adminName}</p>
                    <p className="text-[11px] text-typography-muted font-mono">{log.adminEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="py-3.5 px-4">
                    {log.targetTenantName ? (
                      <div>
                        <p className="font-semibold text-typography-heading">{log.targetTenantName}</p>
                        <p className="text-[10px] text-typography-muted font-mono">{log.targetTenantId}</p>
                      </div>
                    ) : (
                      <span className="text-typography-muted">Plataforma Global</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-typography-body leading-relaxed line-clamp-2">{log.reason}</p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] text-typography-muted">{log.ipAddress}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap text-typography-muted font-mono">
                    {log.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

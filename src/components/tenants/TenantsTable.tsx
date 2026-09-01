import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  Building2,
  Search,
  KeyRound,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-react';
import { Tenant } from '../../types/backoffice.js';

export interface TenantsTableProps {
  tenants: Tenant[];
  onImpersonate: (tenant: Tenant) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function TenantsTable({
  tenants,
  onImpersonate,
  onRefresh,
  loading = false,
}: TenantsTableProps) {
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredTenants = tenants.filter((t) => {
    const q = search.toLowerCase();
    const matchQuery =
      t.name.toLowerCase().includes(q) ||
      t.tradeName.toLowerCase().includes(q) ||
      t.cnpj.includes(q) ||
      t.city.toLowerCase().includes(q);

    if (!matchQuery) return false;
    if (selectedPlan !== 'ALL' && t.plan !== selectedPlan) return false;
    if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;

    return true;
  });

  const getStatusBadge = (status: Tenant['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant="available" size="sm" dot icon={<CheckCircle2 className="w-3 h-3 text-brand-accent" />}>
            Ativo
          </Badge>
        );
      case 'WARNING':
        return (
          <Badge variant="amber" size="sm" dot icon={<AlertTriangle className="w-3 h-3 text-amber-600" />}>
            Alerta Feed
          </Badge>
        );
      case 'SYNC_FAILED':
        return (
          <Badge variant="error" size="sm" dot icon={<XCircle className="w-3 h-3 text-brand-price" />}>
            Falha Sync
          </Badge>
        );
      case 'ONBOARDING':
        return (
          <Badge variant="syncing" size="sm" dot icon={<Clock className="w-3 h-3 text-brand-primary" />}>
            Onboarding
          </Badge>
        );
      default:
        return <Badge variant="neutral" size="sm">Suspenso</Badge>;
    }
  };

  const getPlanBadge = (plan: Tenant['plan']) => {
    switch (plan) {
      case 'ENTERPRISE':
        return <span className="text-[10px] font-bold bg-blue-50 text-brand-primary border border-blue-200 px-2 py-0.5 rounded">Enterprise</span>;
      case 'SCALE':
        return <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded">Scale</span>;
      case 'PRO':
        return <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded">Pro</span>;
      default:
        return <span className="text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded">Starter</span>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 bg-surface-muted/30">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-primary" />
            <h3 className="text-sm font-bold text-typography-heading">
              Gestão Global de Concessionárias & Tenants
            </h3>
            <span className="bg-blue-50 text-brand-primary border border-blue-200 font-bold text-xs px-2 py-0.5 rounded-full">
              {filteredTenants.length} Lojas Cadastradas
            </span>
          </div>
          <p className="text-xs text-typography-muted mt-0.5">
            Monitoramento de status operacional, contratos de faturamento e acesso de auditoria.
          </p>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-typography-subtle absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar loja ou CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-surface-border rounded-lg text-xs text-typography-heading placeholder:text-typography-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
          >
            <option value="ALL">Todos os Planos</option>
            <option value="ENTERPRISE">Enterprise</option>
            <option value="SCALE">Scale</option>
            <option value="PRO">Pro</option>
            <option value="STARTER">Starter</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">Ativos</option>
            <option value="WARNING">Com Alertas</option>
            <option value="SYNC_FAILED">Falha de Sync</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            onClick={onRefresh}
            loading={loading}
          >
            Atualizar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted/60 border-b border-surface-border text-[11px] font-bold text-typography-muted uppercase tracking-wider">
                <th className="py-3 px-4">Concessionária / Razão Social</th>
                <th className="py-3 px-4">CNPJ & Local</th>
                <th className="py-3 px-4">Plano & MRR</th>
                <th className="py-3 px-4">DMS & Estoque</th>
                <th className="py-3 px-4">Saúde Meta DAA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação de Suporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-surface-muted/30 transition-colors">
                  {/* Nome Fantasia e Razão Social */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-typography-heading">{tenant.tradeName}</p>
                      <p className="text-[11px] text-typography-muted">{tenant.name}</p>
                    </div>
                  </td>

                  {/* CNPJ e Cidade */}
                  <td className="py-3.5 px-4">
                    <p className="font-mono text-xs font-semibold text-typography-heading">{tenant.cnpj}</p>
                    <p className="text-[11px] text-typography-muted">{tenant.city} • {tenant.state}</p>
                  </td>

                  {/* Plano & Valor MRR */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {getPlanBadge(tenant.plan)}
                    </div>
                    <span className="font-extrabold text-brand-price text-xs">
                      {tenant.mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                    </span>
                  </td>

                  {/* DMS Conectado & Contagem de Veículos */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-typography-heading">{tenant.dmsProvider}</p>
                    <p className="text-[11px] text-typography-muted">
                      <strong>{tenant.vehiclesCount}</strong> veículos indexados
                    </p>
                  </td>

                  {/* Score de Saúde do Feed */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                      <span className="font-bold text-typography-heading">{tenant.metaHealthScore}%</span>
                    </div>
                    <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          tenant.metaHealthScore >= 98
                            ? 'bg-brand-accent'
                            : tenant.metaHealthScore >= 90
                            ? 'bg-amber-500'
                            : 'bg-brand-price'
                        }`}
                        style={{ width: `${tenant.metaHealthScore}%` }}
                      />
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(tenant.status)}
                  </td>

                  {/* Ação de Impersonation */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<KeyRound className="w-3.5 h-3.5" />}
                      onClick={() => onImpersonate(tenant)}
                      className="shadow-sm"
                    >
                      Acessar como Lojista
                    </Button>
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

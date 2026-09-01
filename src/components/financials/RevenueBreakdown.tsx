import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Layers, Database } from 'lucide-react';
import { PlanDistribution, DmsMarketShare } from '../../types/saasMetrics.js';

export interface RevenueBreakdownProps {
  plans: PlanDistribution[];
  dmsShare: DmsMarketShare[];
}

export function RevenueBreakdown({ plans, dmsShare }: RevenueBreakdownProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 1. Faturamento por Plano (6 cols) */}
      <div className="lg:col-span-6">
        <Card className="h-full">
          <CardHeader className="flex items-center justify-between py-4 bg-surface-muted/30">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-primary" />
              <h3 className="text-sm font-bold text-typography-heading">
                Distribuição de Receita por Plano Contratado
              </h3>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Barra de Progresso Multissegmentada */}
            <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
              {plans.map((p, idx) => {
                const colors = ['bg-blue-600', 'bg-indigo-500', 'bg-purple-600', 'bg-slate-400'];
                return (
                  <div
                    key={p.planKey}
                    style={{ width: `${p.percentageOfRevenue}%` }}
                    className={`${colors[idx % colors.length]} transition-all`}
                    title={`${p.planName}: ${p.percentageOfRevenue}%`}
                  />
                );
              })}
            </div>

            {/* Lista dos Planos */}
            <div className="space-y-2.5 text-xs">
              {plans.map((p) => (
                <div
                  key={p.planKey}
                  className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-bold text-typography-heading">{p.planName}</p>
                    <p className="text-[11px] text-typography-muted">
                      {p.tenantsCount} concessionárias ({p.pricePerTenant.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-brand-price font-mono block">
                      {p.mrrTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-[10px] text-typography-muted font-bold">
                      {p.percentageOfRevenue}% da receita
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Market Share por Integrador DMS (6 cols) */}
      <div className="lg:col-span-6">
        <Card className="h-full">
          <CardHeader className="flex items-center justify-between py-4 bg-surface-muted/30">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-accent" />
              <h3 className="text-sm font-bold text-typography-heading">
                Market Share de Veículos por Integrador DMS
              </h3>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            <div className="space-y-3 text-xs">
              {dmsShare.map((dms) => (
                <div key={dms.dmsName} className="space-y-1.5">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-typography-heading">{dms.dmsName}</span>
                    <span className="text-typography-muted font-mono">
                      <strong>{dms.vehiclesCount.toLocaleString('pt-BR')}</strong> carros ({dms.sharePercentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-primary h-full rounded-full transition-all"
                      style={{ width: `${dms.sharePercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { MonthlyRevenueData } from '../../types/saasMetrics.js';

export interface MrrGrowthChartProps {
  history: MonthlyRevenueData[];
}

export function MrrGrowthChart({ history }: MrrGrowthChartProps) {
  const maxMrr = Math.max(...history.map((h) => h.mrr), 100000);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 bg-surface-muted/30">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-primary" />
            <h3 className="text-sm font-bold text-typography-heading">
              Evolução de MRR & Faturamento Recorrente (Últimos 6 Meses)
            </h3>
          </div>
          <p className="text-xs text-typography-muted mt-0.5">
            Crescimento composto de receita (+75.3% no semestre acumulado).
          </p>
        </div>

        <Badge variant="available" size="sm" dot icon={<ArrowUpRight className="w-3.5 h-3.5 text-brand-accent" />}>
          +R$ 9.300 Net New MRR em Ago/26
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Visualizador de Barras de MRR */}
        <div className="space-y-2">
          <div className="h-48 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-surface-border">
            {history.map((item) => {
              const heightPercent = (item.mrr / maxMrr) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                    <strong>{item.mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    <span className="text-blue-300 block text-[9px]">{item.tenantsCount} concessionárias</span>
                  </div>

                  {/* Barra */}
                  <div className="w-full max-w-[48px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-blue-700 via-blue-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Rótulo do Mês */}
                  <span className="text-xs font-bold text-typography-heading group-hover:text-brand-primary transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown Numérico Mês a Mês */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-muted/50 border-b border-surface-border text-[11px] font-bold text-typography-muted uppercase tracking-wider">
                <th className="py-2.5 px-3">Mês</th>
                <th className="py-2.5 px-3">MRR Fechamento</th>
                <th className="py-2.5 px-3">Novo MRR (Vendas)</th>
                <th className="py-2.5 px-3">Expansão</th>
                <th className="py-2.5 px-3">Churn MRR</th>
                <th className="py-2.5 px-3">Net New MRR</th>
                <th className="py-2.5 px-3 text-right">Lojas Ativas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-mono">
              {history.map((h) => (
                <tr key={h.month} className="hover:bg-surface-muted/30">
                  <td className="py-2.5 px-3 font-sans font-bold text-typography-heading">{h.month}</td>
                  <td className="py-2.5 px-3 font-extrabold text-brand-price">
                    {h.mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2.5 px-3 text-brand-accent">
                    +{h.newMrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2.5 px-3 text-blue-600">
                    +{h.expansionMrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2.5 px-3 text-red-500">
                    -{h.churnedMrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-typography-heading">
                    +{h.netNewMrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans font-semibold text-typography-heading">
                    {h.tenantsCount} lojas
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

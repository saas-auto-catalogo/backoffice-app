import { MetricCard } from '../ui/MetricCard.js';
import { DollarSign, TrendingUp, UserMinus, Target } from 'lucide-react';
import { SaaSFinancialMetrics } from '../../types/saasMetrics.js';

export interface FinancialExecutiveCardsProps {
  data: SaaSFinancialMetrics;
}

export function FinancialExecutiveCards({ data }: FinancialExecutiveCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* MRR Atual */}
      <MetricCard
        title="MRR Contratado"
        value={data.currentMrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        subtitle={`+${data.netNewTenantsThisMonth} novas lojas neste mês`}
        change={`+${data.mrrGrowthMoM}% MoM`}
        changeType="positive"
        icon={<DollarSign className="w-5 h-5 text-brand-price" />}
        highlightPrice
      />

      {/* ARR Projetado */}
      <MetricCard
        title="ARR Projetado (Anual)"
        value={data.arrProjected.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        subtitle="12x Receita Recorrente Atual"
        change="Projeção R$ 1.2M EOY"
        changeType="positive"
        icon={<TrendingUp className="w-5 h-5 text-brand-primary" />}
      />

      {/* Churn Rate Mensal */}
      <MetricCard
        title="Taxa de Churn Mensal"
        value={`${data.churnRateMonthly}%`}
        subtitle="Média da indústria automotiva: 2.1%"
        change="Excelente Retenção"
        changeType="positive"
        icon={<UserMinus className="w-5 h-5 text-brand-accent" />}
      />

      {/* Unit Economics LTV / CAC */}
      <MetricCard
        title="LTV / CAC Ratio"
        value={`${data.ltvCacRatio}x`}
        subtitle={`LTV: R$ ${data.ltvBrl.toLocaleString('pt-BR')} • CAC: R$ ${data.cacBrl}`}
        change={`Payback: ${data.paybackMonths} meses`}
        changeType="positive"
        icon={<Target className="w-5 h-5 text-purple-600" />}
      />
    </div>
  );
}

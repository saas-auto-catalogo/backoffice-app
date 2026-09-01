import { FinancialExecutiveCards } from './FinancialExecutiveCards.js';
import { MrrGrowthChart } from './MrrGrowthChart.js';
import { RevenueBreakdown } from './RevenueBreakdown.js';
import { FeedTrafficThroughput } from './FeedTrafficThroughput.js';
import { SaaSFinancialMetrics } from '../../types/saasMetrics.js';

export interface SaaSFinancialsDashboardProps {
  data: SaaSFinancialMetrics;
}

export function SaaSFinancialsDashboard({ data }: SaaSFinancialsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 1. Cards de Unit Economics e Métricas Executivas */}
      <FinancialExecutiveCards data={data} />

      {/* 2. Banner de Volumetria de Feeds & Tráfego CDN */}
      <FeedTrafficThroughput
        monthlyHits={data.feedRequestsMonthly}
        cacheHitRate={data.feedCacheHitRate}
        totalVehicles={data.totalVehiclesManaged}
      />

      {/* 3. Gráfico de Evolução Mensal do MRR */}
      <MrrGrowthChart history={data.monthlyHistory} />

      {/* 4. Distribuição de Faturamento por Plano e Integrador DMS */}
      <RevenueBreakdown plans={data.plansDistribution} dmsShare={data.dmsDistribution} />
    </div>
  );
}

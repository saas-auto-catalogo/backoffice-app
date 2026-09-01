import { MetricCard } from '../ui/MetricCard.js';
import { ShieldCheck, AlertOctagon, Clock, Gauge } from 'lucide-react';
import { FeedsTelemetryMetrics } from '../../types/feedMonitoring.js';

export interface FeedHealthOverviewProps {
  metrics: FeedsTelemetryMetrics;
}

export function FeedHealthOverview({ metrics }: FeedHealthOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Feeds 100% Saudáveis"
        value={metrics.healthyFeedsCount}
        subtitle={`De um total de ${metrics.totalFeeds} feeds DMS ativos`}
        change={`${((metrics.healthyFeedsCount / (metrics.totalFeeds || 1)) * 100).toFixed(0)}% conformes`}
        changeType="positive"
        icon={<ShieldCheck className="w-5 h-5 text-brand-accent" />}
      />

      <MetricCard
        title="Erros de Parsing / Schema"
        value={metrics.parsingErrorsCount}
        subtitle="Inconsistências de fotos, preços ou tags"
        change={metrics.parsingErrorsCount > 0 ? "Ação Requerida" : "Nenhum Erro"}
        changeType={metrics.parsingErrorsCount > 0 ? "negative" : "positive"}
        icon={<AlertOctagon className="w-5 h-5 text-brand-price" />}
        highlightPrice={metrics.parsingErrorsCount > 0}
      />

      <MetricCard
        title="Feeds Obsoletos (> 24h)"
        value={metrics.staleFeedsCount}
        subtitle="Sem atualização na janela diária de sync"
        change={metrics.staleFeedsCount > 0 ? "Timeout DMS" : "Em Dia"}
        changeType={metrics.staleFeedsCount > 0 ? "negative" : "positive"}
        icon={<Clock className="w-5 h-5 text-amber-600" />}
      />

      <MetricCard
        title="Latência Média Ingestão"
        value={`${metrics.avgIngestionLatencyMs}ms`}
        subtitle={`${metrics.totalVehiclesMonitored.toLocaleString('pt-BR')} veículos sob custódia`}
        change="Alta Velocidade"
        changeType="positive"
        icon={<Gauge className="w-5 h-5 text-brand-primary" />}
      />
    </div>
  );
}

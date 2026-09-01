import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  GitBranch,
  Search,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  FileCode,
  Sparkles
} from 'lucide-react';
import { MonitoredFeed } from '../../types/feedMonitoring.js';

export interface FeedMonitoringTableProps {
  feeds: MonitoredFeed[];
  onOpenDiagnostic: (feed: MonitoredFeed) => void;
  onReSyncSingle: (feed: MonitoredFeed) => void;
  onReSyncBatch: (feedIds: string[]) => void;
  onRefresh?: () => void;
  loading?: boolean;
  isSyncingBatch?: boolean;
}

export function FeedMonitoringTable({
  feeds,
  onOpenDiagnostic,
  onReSyncSingle,
  onReSyncBatch,
  onRefresh,
  loading = false,
  isSyncingBatch = false,
}: FeedMonitoringTableProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDms, setSelectedDms] = useState<string>('ALL');
  const [selectedFeedIds, setSelectedFeedIds] = useState<string[]>([]);

  const filteredFeeds = feeds.filter((f) => {
    const q = search.toLowerCase();
    const matchQuery =
      f.tenantName.toLowerCase().includes(q) ||
      f.tenantTradeName.toLowerCase().includes(q) ||
      f.dmsProvider.toLowerCase().includes(q) ||
      f.xmlSourceUrl.toLowerCase().includes(q);

    if (!matchQuery) return false;
    if (selectedStatus !== 'ALL' && f.status !== selectedStatus) return false;
    if (selectedDms !== 'ALL' && !f.dmsProvider.includes(selectedDms)) return false;

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFeedIds(filteredFeeds.map((f) => f.id));
    } else {
      setSelectedFeedIds([]);
    }
  };

  const handleToggleFeed = (id: string) => {
    setSelectedFeedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: MonitoredFeed['status']) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <Badge variant="available" size="sm" dot icon={<CheckCircle2 className="w-3 h-3 text-brand-accent" />}>
            100% Saudável
          </Badge>
        );
      case 'PARSING_ERROR':
      case 'SCHEMA_INVALID':
        return (
          <Badge variant="error" size="sm" dot icon={<XCircle className="w-3 h-3 text-brand-price" />}>
            Erro de Parsing
          </Badge>
        );
      case 'STALE_OVER_24H':
        return (
          <Badge variant="amber" size="sm" dot icon={<Clock className="w-3 h-3 text-amber-600" />}>
            Obsoleto (&gt; 24h)
          </Badge>
        );
      case 'TOKEN_EXPIRED':
        return (
          <Badge variant="neutral" size="sm" dot icon={<KeyRound className="w-3 h-3 text-slate-500" />}>
            Token Expirado
          </Badge>
        );
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 bg-surface-muted/30">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-brand-primary" />
            <h3 className="text-sm font-bold text-typography-heading">
              Monitoramento em Tempo Real de Feeds XML
            </h3>
            <span className="bg-blue-50 text-brand-primary border border-blue-200 font-bold text-xs px-2 py-0.5 rounded-full">
              {filteredFeeds.length} Feeds Monitorados
            </span>
          </div>
          <p className="text-xs text-typography-muted mt-0.5">
            Diagnóstico de conformidade de schema, parsing e disparo de re-sincronização de pipelines DMS.
          </p>
        </div>

        {/* Filtros e Ação em Lote */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-typography-subtle absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar concessionária, DMS ou URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-surface-border rounded-lg text-xs text-typography-heading placeholder:text-typography-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
          >
            <option value="ALL">Todos os Status</option>
            <option value="HEALTHY">100% Saudáveis</option>
            <option value="PARSING_ERROR">Erros de Parsing</option>
            <option value="STALE_OVER_24H">Obsoletos (&gt; 24h)</option>
            <option value="TOKEN_EXPIRED">Token Expirado</option>
          </select>

          <select
            value={selectedDms}
            onChange={(e) => setSelectedDms(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
          >
            <option value="ALL">Todos os DMS</option>
            <option value="AutoCerto">AutoCerto XML</option>
            <option value="Altimus">Altimus Hub</option>
            <option value="Sisvag">Sisvag DMS</option>
            <option value="BomControle">BomControle ERP</option>
            <option value="Webmotors">Webmotors Integra</option>
          </select>

          {/* Botão de Re-sync em Lote */}
          {selectedFeedIds.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<RotateCw className={`w-3.5 h-3.5 ${isSyncingBatch ? 'animate-spin' : ''}`} />}
              onClick={() => onReSyncBatch(selectedFeedIds)}
              loading={isSyncingBatch}
            >
              Re-sync Lote ({selectedFeedIds.length})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            icon={<RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
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
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedFeedIds.length === filteredFeeds.length && filteredFeeds.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-brand-primary focus:ring-brand-primary"
                  />
                </th>
                <th className="py-3 px-4">Concessionária / Integrador</th>
                <th className="py-3 px-4">Última Ingestão & Latência</th>
                <th className="py-3 px-4">Veículos / Meta DAA</th>
                <th className="py-3 px-4">Saúde do Feed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações de Operação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs">
              {filteredFeeds.map((feed) => {
                const isSelected = selectedFeedIds.includes(feed.id);
                return (
                  <tr
                    key={feed.id}
                    className={`transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-surface-muted/30'}`}
                  >
                    {/* Checkbox de Seleção */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleFeed(feed.id)}
                        className="rounded text-brand-primary focus:ring-brand-primary"
                      />
                    </td>

                    {/* Concessionária & Integrador */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-typography-heading">{feed.tenantTradeName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                            {feed.dmsProvider}
                          </span>
                          <span className="text-[10px] text-typography-subtle font-mono truncate max-w-[200px]">
                            {feed.xmlSourceUrl}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Última Ingestão & Duração */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-typography-heading">{feed.lastSyncAt}</p>
                      <p className="text-[10px] text-typography-muted font-mono">
                        Duração: <strong>{feed.lastSyncDurationMs}ms</strong> • HTTP {feed.lastHttpCode}
                      </p>
                    </td>

                    {/* Veículos Válidos vs Total */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-brand-accent">{feed.vehiclesValid}</span>
                        <span className="text-typography-subtle">/</span>
                        <span className="text-typography-heading">{feed.vehiclesTotal} carros</span>
                      </div>
                      {feed.vehiclesInvalid > 0 && (
                        <p className="text-[10px] text-brand-price font-semibold mt-0.5">
                          {feed.vehiclesInvalid} com inconsistências
                        </p>
                      )}
                    </td>

                    {/* Score de Saúde */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                        <span className="font-bold text-typography-heading">{feed.healthScore}%</span>
                      </div>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            feed.healthScore >= 98
                              ? 'bg-brand-accent'
                              : feed.healthScore >= 80
                              ? 'bg-amber-500'
                              : 'bg-brand-price'
                          }`}
                          style={{ width: `${feed.healthScore}%` }}
                        />
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(feed.status)}
                    </td>

                    {/* Ações: Diagnóstico e Re-sync */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FileCode className="w-3.5 h-3.5" />}
                          onClick={() => onOpenDiagnostic(feed)}
                        >
                          Diagnóstico
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          icon={<RotateCw className="w-3.5 h-3.5" />}
                          onClick={() => onReSyncSingle(feed)}
                        >
                          Re-sync
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

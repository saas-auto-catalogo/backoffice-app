import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  X,
  AlertTriangle,
  FileCode,
  ShieldCheck,
  RotateCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { MonitoredFeed } from '../../types/feedMonitoring.js';

export interface FeedDiagnosticModalProps {
  feed: MonitoredFeed | null;
  isOpen: boolean;
  onClose: () => void;
  onReSync: (feed: MonitoredFeed) => void;
  isSyncing?: boolean;
}

export function FeedDiagnosticModal({
  feed,
  isOpen,
  onClose,
  onReSync,
  isSyncing = false,
}: FeedDiagnosticModalProps) {
  if (!isOpen || !feed) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-2xl overflow-hidden border-slate-300 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Diagnóstico Avançado de Feed XML & Meta DAA
              </h3>
              <p className="text-xs text-blue-200">
                {feed.tenantTradeName} • Provedor: {feed.dmsProvider}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </CardHeader>

        <CardContent className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Resumo de Conexão */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-surface-muted/60 border border-surface-border">
              <span className="text-[10px] text-typography-muted block">Score de Saúde</span>
              <span className="text-sm font-bold text-typography-heading">{feed.healthScore}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-muted/60 border border-surface-border">
              <span className="text-[10px] text-typography-muted block">Veículos Válidos</span>
              <span className="text-sm font-bold text-brand-accent">{feed.vehiclesValid} de {feed.vehiclesTotal}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-muted/60 border border-surface-border">
              <span className="text-[10px] text-typography-muted block">HTTP Status</span>
              <span className="text-sm font-bold font-mono text-typography-heading">{feed.lastHttpCode}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-muted/60 border border-surface-border">
              <span className="text-[10px] text-typography-muted block">Latência Ingestão</span>
              <span className="text-sm font-bold font-mono text-typography-heading">{feed.lastSyncDurationMs}ms</span>
            </div>
          </div>

          {/* Endpoint de Origem */}
          <div className="p-3 bg-surface-muted/50 rounded-xl border border-surface-border space-y-1">
            <span className="text-[10px] font-bold text-typography-muted uppercase tracking-wider block">
              URL do Endpoint DMS de Origem:
            </span>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs font-mono text-brand-primary truncate">{feed.xmlSourceUrl}</code>
              <a
                href={feed.xmlSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-typography-muted hover:text-brand-primary shrink-0"
                title="Abrir URL do Feed"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Lista de Inconsistências Detectadas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-typography-heading flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-brand-price" />
              <span>Inconsistências e Alertas Detectados ({feed.issues.length})</span>
            </h4>

            {feed.issues.length === 0 ? (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center text-xs text-green-800 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Nenhum erro detectado! O feed XML está 100% aderente ao catálogo Meta Automotive Ads.</span>
              </div>
            ) : (
              feed.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    issue.severity === 'CRITICAL'
                      ? 'bg-red-50/70 border-red-200'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-typography-heading">{issue.code}</span>
                    <Badge variant={issue.severity === 'CRITICAL' ? 'error' : 'amber'} size="sm">
                      {issue.affectedCount} veículos afetados
                    </Badge>
                  </div>

                  <p className="text-typography-body leading-relaxed">{issue.message}</p>

                  {issue.sampleNodeXml && (
                    <div className="p-2.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto border border-slate-800">
                      <span className="text-blue-400 text-[10px] block mb-0.5">// Trecho XML com problema:</span>
                      <code>{issue.sampleNodeXml}</code>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Ações */}
          <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
            <div className="text-[11px] text-typography-muted flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-typography-subtle" />
              <span>Expiração do token: <strong className="font-mono">{feed.tokenExpiresAt}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
                onClick={() => onReSync(feed)}
                loading={isSyncing}
              >
                Forçar Re-sync do Feed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

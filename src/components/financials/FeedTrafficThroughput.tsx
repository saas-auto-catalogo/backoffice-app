import { Card, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { Globe2, Zap, ShieldCheck } from 'lucide-react';

export interface FeedTrafficThroughputProps {
  monthlyHits: number;
  cacheHitRate: number;
  totalVehicles: number;
}

export function FeedTrafficThroughput({
  monthlyHits,
  cacheHitRate,
  totalVehicles,
}: FeedTrafficThroughputProps) {
  return (
    <Card className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden border-slate-800 shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                Meta Automotive Ads Graph API
              </span>
              <Badge variant="available" size="sm" dot>
                CDN Edge Ativo
              </Badge>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-400" />
              <span>Volumetria Global de Requisições aos Feeds XML</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O ecossistema do Auto Catálogo responde diariamente a milhões de consultas originadas pelos robôs de catálogo do Instagram e Facebook para atualização de anúncios dinâmicos.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0 text-center">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Requisições / Mês</span>
              <span className="text-base font-extrabold text-white font-mono">
                {(monthlyHits / 1000000).toFixed(2)}M hits
              </span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cache Hit Rate</span>
              <span className="text-base font-extrabold text-green-400 font-mono flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {cacheHitRate}%
              </span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Veículos Indexados</span>
              <span className="text-base font-extrabold text-blue-300 font-mono flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {totalVehicles.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { ShieldAlert, LogOut, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button.js';
import { Tenant } from '../../types/backoffice.js';

export interface ImpersonateBannerProps {
  tenant: Tenant;
  onExit: () => void;
}

export function ImpersonateBanner({ tenant, onExit }: ImpersonateBannerProps) {
  return (
    <div className="bg-amber-500 text-slate-950 px-6 py-2.5 flex items-center justify-between shadow-md select-none sticky top-0 z-50 border-b border-amber-600 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-black/10">
          <ShieldAlert className="w-5 h-5 text-slate-950 animate-bounce" />
        </div>
        <div>
          <p className="text-xs font-bold leading-tight">
            MODO DE IMPERSONATION ATIVO — Você está operando como Super Admin na conta da concessionária:
          </p>
          <p className="text-xs font-semibold text-slate-900 mt-0.5">
            <strong>{tenant.tradeName}</strong> • CNPJ: <span className="font-mono">{tenant.cnpj}</span> • Plano: {tenant.plan}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => window.open(`http://localhost:5173/?impersonate_token=${tenant.feedToken}`, '_blank')}
          className="text-xs font-bold underline hover:text-black flex items-center gap-1"
        >
          <span>Abrir Frontend do Lojista</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <Button
          variant="danger"
          size="sm"
          icon={<LogOut className="w-3.5 h-3.5" />}
          onClick={onExit}
          className="bg-slate-950 text-white hover:bg-slate-900 border-none font-bold"
        >
          Encerrar Impersonation
        </Button>
      </div>
    </div>
  );
}

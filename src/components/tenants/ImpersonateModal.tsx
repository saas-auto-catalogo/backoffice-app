import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Button } from '../ui/Button.js';
import { ShieldCheck, AlertTriangle, X, Lock } from 'lucide-react';
import { Tenant } from '../../types/backoffice.js';

export interface ImpersonateModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tenant: Tenant, reason: string) => void;
  isLoading?: boolean;
}

export function ImpersonateModal({
  tenant,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ImpersonateModalProps) {
  const [reason, setReason] = useState('Suporte Técnico / Auditoria de Feed Meta XML');
  const [agreed, setAgreed] = useState(false);

  if (!isOpen || !tenant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !reason.trim()) return;
    onConfirm(tenant, reason);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-lg overflow-hidden border-slate-300 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-typography-heading">
                Acesso Seguro por Impersonation
              </h3>
              <p className="text-xs text-typography-muted">
                Login temporário de Super Admin na conta da revenda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-typography-muted hover:text-typography-heading hover:bg-surface-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Dados do Tenant Alvo */}
          <div className="p-3.5 rounded-xl bg-surface-muted/60 border border-surface-border space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-typography-muted uppercase tracking-wider text-[10px] font-bold">
                Concessionária Alvo
              </span>
              <span className="font-mono text-brand-primary font-semibold">{tenant.id}</span>
            </div>
            <p className="text-sm font-bold text-typography-heading">{tenant.tradeName}</p>
            <p className="text-typography-muted">
              Razão Social: {tenant.name} • CNPJ: <span className="font-mono">{tenant.cnpj}</span>
            </p>
            <p className="text-typography-muted">
              Plano: <strong>{tenant.plan}</strong> • Estoque: <strong>{tenant.vehiclesCount} carros</strong>
            </p>
          </div>

          {/* Termo de Auditoria e Responsabilidade */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Registro Compulsório no AuditLog</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Esta ação será auditada e gravada de forma imutável com o seu email de administrador, IP de conexão, data/hora e a justificativa preenchida abaixo.
            </p>
          </div>

          {/* Formulário de Justificativa */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-typography-heading mb-1">
                Justificativa Operacional do Acesso <span className="text-brand-price">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-brand-primary mb-2 font-medium"
              >
                <option value="Suporte Técnico / Auditoria de Feed Meta XML">Suporte Técnico / Auditoria de Feed Meta XML</option>
                <option value="Ajuste de Mapeamento De/Para do Integrador DMS">Ajuste de Mapeamento De/Para do Integrador DMS</option>
                <option value="Diagnóstico de Erros de Sincronização Meta Ads">Diagnóstico de Erros de Sincronização Meta Ads</option>
                <option value="Verificação de Onboarding e Ativação do Catálogo">Verificação de Onboarding e Ativação do Catálogo</option>
                <option value="Outro (Especificar)">Outro (Especificar na auditoria)</option>
              </select>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-typography-body font-medium">
                Confirmo que este acesso é estritamente operacional e estou ciente da gravação da trilha de auditoria.
              </span>
            </label>

            {/* Ações */}
            <div className="pt-3 border-t border-surface-border flex items-center justify-end gap-2.5">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!agreed || isLoading}
                loading={isLoading}
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                Iniciar Sessão de Impersonation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

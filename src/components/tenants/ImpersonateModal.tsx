import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Button } from '../ui/Button.js';
import { ShieldCheck, AlertTriangle, X, Lock, ShieldAlert } from 'lucide-react';
import { Tenant } from '../../types/backoffice.js';

export interface ImpersonateModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tenant: Tenant, reason: string) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const PRESET_REASONS = [
  'Suporte Técnico / Auditoria de Feed Meta XML',
  'Ajuste de Mapeamento De/Para do Integrador DMS',
  'Diagnóstico de Erros de Sincronização Meta Ads',
  'Verificação de Onboarding e Ativação do Catálogo',
  'Outro (Descrever motivo específico abaixo)',
];

export function ImpersonateModal({
  tenant,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  errorMessage,
}: ImpersonateModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESET_REASONS[0]);
  const [reason, setReason] = useState<string>(PRESET_REASONS[0]);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(PRESET_REASONS[0]);
      setReason(PRESET_REASONS[0]);
      setAgreed(false);
    }
  }, [isOpen]);

  if (!isOpen || !tenant) return null;

  const trimmedReason = reason.trim();
  const isReasonValid = trimmedReason.length >= 10;
  const isMfaError =
    Boolean(errorMessage && (errorMessage.includes('MFA') || errorMessage.includes('2FA')));

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPreset(val);
    if (val === 'Outro (Descrever motivo específico abaixo)') {
      setReason('');
    } else {
      setReason(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !isReasonValid || isLoading) return;
    onConfirm(tenant, trimmedReason);
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
          {/* Alerta de Erro de MFA ou Geral */}
          {errorMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                isMfaError
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>
                  {isMfaError
                    ? 'Autenticação de Dois Fatores (MFA/2FA) Obrigatória'
                    : 'Atenção ao Iniciar Sessão'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isMfaError
                  ? 'É obrigatório ter a autenticação de dois fatores (MFA/2FA) ativada para iniciar sessões de impersonation por motivos de conformidade e segurança. Por favor, ative o MFA em seu perfil antes de prosseguir.'
                  : errorMessage}
              </p>
            </div>
          )}

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
                value={selectedPreset}
                onChange={handlePresetChange}
                className="w-full text-xs px-3 py-2 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-brand-primary mb-2 font-medium"
              >
                {PRESET_REASONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo do suporte..."
                rows={3}
                className={`w-full text-xs p-3 bg-white border rounded-lg text-typography-heading focus:outline-none focus:ring-2 font-medium transition-colors ${
                  !isReasonValid && trimmedReason.length > 0
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-surface-border focus:ring-brand-primary'
                }`}
              />

              {!isReasonValid && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">
                  Mínimo de 10 caracteres para a justificativa ({trimmedReason.length}/10).
                </p>
              )}
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
                disabled={!agreed || !isReasonValid || isLoading}
                loading={isLoading}
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Sessão de Impersonation'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

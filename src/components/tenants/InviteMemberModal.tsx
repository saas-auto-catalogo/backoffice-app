import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';
import { UserPlus, X, Mail } from 'lucide-react';
import { Tenant, WorkspaceMemberRole } from '../../types/backoffice.js';

export interface InviteMemberModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onInvite: (payload: { email: string; role: WorkspaceMemberRole; name?: string }) => Promise<void>;
  isLoading?: boolean;
}

const ROLE_OPTIONS: Array<{ value: WorkspaceMemberRole; label: string; description: string }> = [
  { value: 'MANAGER', label: 'Manager', description: 'Gerencia feeds, estoque e demais membros.' },
  { value: 'VIEWER', label: 'Viewer', description: 'Acesso somente leitura ao catálogo e relatórios.' },
  { value: 'OWNER', label: 'Owner', description: 'Controle total do workspace, incluindo faturamento.' },
];

export function InviteMemberModal({
  tenant,
  isOpen,
  onClose,
  onInvite,
  isLoading = false,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<WorkspaceMemberRole>('VIEWER');

  if (!isOpen || !tenant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await onInvite({
      email: email.trim(),
      role,
      name: name.trim() || undefined,
    });
    setEmail('');
    setName('');
    setRole('VIEWER');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-lg overflow-hidden border-slate-300 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-typography-heading">Convidar Novo Membro</h3>
              <p className="text-xs text-typography-muted">
                Acesso cross-tenant para {tenant.tradeName}
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
          <div className="p-3 rounded-xl bg-surface-muted/60 border border-surface-border text-xs flex items-center justify-between">
            <span className="text-typography-muted uppercase tracking-wider text-[10px] font-bold">
              Workspace Alvo
            </span>
            <span className="font-semibold text-typography-heading">{tenant.tradeName}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-typography-heading mb-1">
                E-mail do Membro <span className="text-brand-price">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-typography-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colaborador@concessionaria.com.br"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-surface-border rounded-lg text-xs text-typography-heading placeholder:text-typography-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-typography-heading mb-1">
                Nome (opcional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo do colaborador"
                className="w-full px-3 py-2 bg-white border border-surface-border rounded-lg text-xs text-typography-heading placeholder:text-typography-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-typography-heading mb-1.5">
                Papel de Acesso
              </label>
              <div className="space-y-2">
                {ROLE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      role === opt.value
                        ? 'border-brand-primary bg-blue-50/80'
                        : 'border-surface-border bg-white hover:bg-surface-muted/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={role === opt.value}
                      onChange={() => setRole(opt.value)}
                      className="mt-1 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-typography-heading flex items-center gap-2">
                        {opt.label}
                        {opt.value === 'OWNER' && <Badge variant="amber" size="sm">Full Access</Badge>}
                      </span>
                      <span className="text-[11px] text-typography-muted">{opt.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-end gap-2.5">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!email.trim() || isLoading}
                loading={isLoading}
                icon={<UserPlus className="w-4 h-4" />}
              >
                Enviar Convite
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
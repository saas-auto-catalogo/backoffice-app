import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Server } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { useAuth } from '../context/AuthContext.js';
import { ApiError } from '../types/api.js';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || '/';

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Informe seu email';
    } else if (!isValidEmail(email)) {
      errors.email = 'Email inválido';
    }

    if (!password) {
      errors.password = 'Informe sua senha';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError('Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-brand-secondary to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Master Ops Backoffice
          </h1>
          <p className="text-sm text-blue-200/80 mt-1.5">
            Painel interno de governança SaaS
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-secondary" />
            <span className="text-xs font-bold text-typography-heading uppercase tracking-wider">
              Acesso Super Admin
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
            {formError ? (
              <div className="rounded-lg border border-brand-price/30 bg-brand-priceLight px-3.5 py-2.5 text-sm text-brand-price">
                {formError}
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-typography-heading mb-1.5">
                Email corporativo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@drivesync.me"
                className={`w-full text-sm px-3 py-2.5 bg-white border rounded-lg text-typography-heading placeholder:text-typography-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
                  fieldErrors.email ? 'border-brand-price' : 'border-surface-border'
                }`}
              />
              {fieldErrors.email ? (
                <p className="mt-1 text-xs text-brand-price">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-typography-heading mb-1.5">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full text-sm px-3 py-2.5 bg-white border rounded-lg text-typography-heading placeholder:text-typography-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
                  fieldErrors.password ? 'border-brand-price' : 'border-surface-border'
                }`}
              />
              {fieldErrors.password ? (
                <p className="mt-1 text-xs text-brand-price">{fieldErrors.password}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Entrar no Backoffice
            </Button>

            <div className="flex items-center gap-2 justify-center text-[11px] text-typography-muted pt-1">
              <Server className="w-3.5 h-3.5" />
              <span>Acesso restrito a administradores da plataforma</span>
            </div>
          </form>
        </div>

        <p className="text-center text-[11px] text-blue-300/60 mt-6 font-mono">
          DriveSync • Super Admin Console
        </p>
      </div>
    </div>
  );
}

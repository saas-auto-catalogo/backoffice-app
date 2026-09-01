import { useNavigate } from 'react-router-dom';
import { Search, Bell, Activity, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '../ui/Button.js';
import { useAuth } from '../../context/AuthContext.js';

export interface SuperAdminHeaderProps {
  onForceSyncAll?: () => void;
  isSyncingAll?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function SuperAdminHeader({
  onForceSyncAll,
  isSyncingAll = false,
}: SuperAdminHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.name ?? 'Super Admin';
  const displayEmail = user?.email ?? '';
  const initials = getInitials(displayName);

  return (
    <header className="bg-surface-card border-b border-surface-border h-16 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-subtle">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-typography-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar concessionária por CNPJ, Razão Social, Nome Fantasia ou ID..."
            className="w-full pl-9 pr-4 py-2 bg-surface-muted/60 border border-surface-border rounded-lg text-xs text-typography-body placeholder:text-typography-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-xs font-semibold text-green-800">
          <Activity className="w-3.5 h-3.5 text-green-600 animate-pulse" />
          <span>8 Workers Ativos</span>
          <span className="text-green-600">•</span>
          <span className="font-mono text-[11px]">Fila Redis: 0</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />}
          onClick={onForceSyncAll}
          loading={isSyncingAll}
        >
          Forçar Sync Global
        </Button>

        <div className="h-6 w-[1px] bg-surface-border mx-1" />

        <button className="p-2 text-typography-muted hover:text-typography-heading hover:bg-surface-muted rounded-md relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-price absolute top-1.5 right-1.5" />
        </button>

        <button
          onClick={() => void handleLogout()}
          className="p-2 text-typography-muted hover:text-typography-heading hover:bg-surface-muted rounded-md transition-colors"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {initials || 'SA'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-typography-heading leading-tight">{displayName}</p>
            <p className="text-[10px] text-typography-muted font-mono leading-tight">{displayEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

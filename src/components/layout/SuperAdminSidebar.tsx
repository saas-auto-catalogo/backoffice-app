import {
  Building2,
  GitBranch,
  FileCheck2,
  DollarSign,
  ScrollText,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Server
} from 'lucide-react';

export interface SuperAdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SuperAdminSidebar({
  activeTab,
  onTabChange,
}: SuperAdminSidebarProps) {
  const menuItems = [
    {
      id: 'tenants',
      label: 'Concessionárias & Tenants',
      icon: <Building2 className="w-4 h-4" />,
      badge: '128',
    },
    {
      id: 'pipelines',
      label: 'Pipelines & Cron Jobs XML',
      icon: <GitBranch className="w-4 h-4" />,
      highlight: true,
    },
    {
      id: 'ai-moderation',
      label: 'Moderação AI Blog & SEO',
      icon: <FileCheck2 className="w-4 h-4" />,
      alertCount: 3,
    },
    {
      id: 'financials',
      label: 'Faturamento & MRR',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: 'audit-logs',
      label: 'Trilha de Auditoria (Logs)',
      icon: <ScrollText className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0037B0] via-[#002F99] to-[#002270] text-white flex flex-col shrink-0 border-r border-blue-900 select-none min-h-screen shadow-xl">
      {/* Brand & SuperAdmin Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10 bg-black/10">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#0037B0] shadow-md font-bold">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-white tracking-tight">Auto Catálogo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-blue-200 font-mono">SuperAdmin Hub</span>
            <span className="text-[9px] bg-white/20 text-blue-100 px-1 py-0.2 rounded font-bold uppercase">
              Master Ops
            </span>
          </div>
        </div>
      </div>

      {/* Cluster / Server Status Card */}
      <div className="p-3 mx-3 my-3 bg-white/10 rounded-lg border border-white/15 flex items-center gap-2.5 backdrop-blur-sm">
        <div className="w-7 h-7 rounded-md bg-white/20 text-white flex items-center justify-center font-bold text-xs">
          <Server className="w-3.5 h-3.5 text-green-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">Cluster AWS sa-east-1</p>
          <p className="text-[10px] text-blue-200 truncate">8 Workers Ativos • 0 Fila</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
      </div>

      {/* Menu Navigation */}
      <div className="flex-1 px-3 py-2 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
          Operações Globais
        </div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-white text-[#0037B0] font-bold shadow-md translate-x-0.5'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-[#0037B0]' : 'text-blue-200 group-hover:text-white'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.alertCount ? (
                  <span className="bg-brand-price text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.alertCount}
                  </span>
                ) : null}

                {item.badge ? (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-blue-100 text-[#0037B0]' : 'bg-white/15 text-blue-100'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}

                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#0037B0]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* SuperAdmin Footer Security Badge */}
      <div className="p-4 m-3 bg-black/20 border border-white/15 rounded-xl space-y-2 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="text-blue-100 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-green-300" />
            Audit Trail
          </span>
          <span className="text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-400/30 px-1.5 py-0.2 rounded-full">
            100% Gravado
          </span>
        </div>
        <p className="text-[11px] text-blue-200">
          Todas as sessões de Impersonation são auditadas com carimbo de IP e Justificativa.
        </p>
      </div>
    </aside>
  );
}

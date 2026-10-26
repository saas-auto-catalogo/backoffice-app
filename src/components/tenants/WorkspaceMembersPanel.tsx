import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.js';
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  X,
  Users,
  UserPlus,
  KeyRound,
  Trash2,
  ShieldAlert,
  MailPlus,
  RefreshCw,
  Activity,
  ScrollText,
  Clock,
  AlertTriangle,
  Crown,
  ShieldCheck,
  Eye,
  History
} from 'lucide-react';
import { Tenant, WorkspaceMember, WorkspaceMemberRole, AuditLog } from '../../types/backoffice.js';
import { workspaceMembersService } from '../../services/api/workspaceMembersService.js';
import { InviteMemberModal } from './InviteMemberModal.js';

export interface WorkspaceMembersPanelProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onImpersonate: (tenant: Tenant) => void;
  onRefreshAudit?: () => void;
}

type ConfirmState =
  | { kind: 'remove'; member: WorkspaceMember }
  | { kind: 'role'; member: WorkspaceMember; role: WorkspaceMemberRole }
  | null;

function RoleBadge({ role }: { role: WorkspaceMemberRole }) {
  switch (role) {
    case 'OWNER':
      return (
        <Badge variant="amber" size="sm" icon={<Crown className="w-3 h-3 text-amber-600" />}>
          Owner
        </Badge>
      );
    case 'MANAGER':
      return (
        <Badge variant="syncing" size="sm" icon={<ShieldCheck className="w-3 h-3 text-brand-primary" />}>
          Manager
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size="sm" icon={<Eye className="w-3 h-3 text-slate-500" />}>
          Viewer
        </Badge>
      );
  }
}

function StatusBadge({ status }: { status: WorkspaceMember['status'] }) {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant="available" size="sm" dot>Ativo</Badge>;
    case 'PENDING':
      return <Badge variant="amber" size="sm" dot>Pendente</Badge>;
    default:
      return <Badge variant="neutral" size="sm" dot>Desativado</Badge>;
  }
}

function AuditActionBadge({ action }: { action: AuditLog['action'] }) {
  switch (action) {
    case 'MEMBER_INVITE':
      return (
        <Badge variant="syncing" size="sm" icon={<MailPlus className="w-3 h-3 text-brand-primary" />}>
          Convite Enviado
        </Badge>
      );
    case 'MEMBER_ROLE_CHANGE':
      return (
        <Badge variant="amber" size="sm" icon={<ShieldCheck className="w-3 h-3 text-amber-600" />}>
          Papel Alterado
        </Badge>
      );
    case 'MEMBER_REMOVE':
      return (
        <Badge variant="error" size="sm" icon={<Trash2 className="w-3 h-3 text-brand-price" />}>
          Membro Removido
        </Badge>
      );
    default:
      return <Badge variant="neutral" size="sm">{action}</Badge>;
  }
}

export function WorkspaceMembersPanel({
  tenant,
  isOpen,
  onClose,
  onImpersonate,
  onRefreshAudit,
}: WorkspaceMembersPanelProps) {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberAuditLogs, setMemberAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);
  const [inviteOpen, setInviteOpen] = useState<boolean>(false);
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [mutatingLabel, setMutatingLabel] = useState<string>('');
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null;

  const loadMembers = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    const items = await workspaceMembersService.listMembers(tenant.id);
    setMembers(items);
    setSelectedMemberId((prev) => prev ?? items[0]?.id ?? null);
    setLoading(false);
  }, [tenant]);

  useEffect(() => {
    if (isOpen && tenant) {
      setSelectedMemberId(null);
      setErrorMsg(null);
      setConfirm(null);
      setMemberAuditLogs([]);
      loadMembers();
    }
  }, [isOpen, tenant, loadMembers]);

  useEffect(() => {
    if (!tenant || !selectedMemberId) {
      setMemberAuditLogs([]);
      return;
    }
    let cancelled = false;
    setAuditLoading(true);
    workspaceMembersService
      .listMemberAuditLogs(tenant.id, selectedMemberId)
      .then((logs) => {
        if (!cancelled) setMemberAuditLogs(logs);
      })
      .finally(() => {
        if (!cancelled) setAuditLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tenant, selectedMemberId]);

  const handleInvite = async (payload: { email: string; role: WorkspaceMemberRole; name?: string }) => {
    if (!tenant) return;
    try {
      setIsInviting(true);
      setErrorMsg(null);
      await workspaceMembersService.inviteMember(tenant.id, payload);
      await loadMembers();
      setSelectedMemberId((prev) => prev ?? members[0]?.id ?? null);
      onRefreshAudit?.();
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Falha ao enviar convite.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleConfirmRole = async () => {
    if (!tenant || !confirm || confirm.kind !== 'role') return;
    const { member, role } = confirm;
    try {
      setIsMutating(true);
      setMutatingLabel(`Alterando papel de ${member.email}...`);
      setErrorMsg(null);
      await workspaceMembersService.updateMemberRole(tenant.id, member.id, role);
      setConfirm(null);
      await loadMembers();
      onRefreshAudit?.();
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Falha ao alterar o papel do membro.');
    } finally {
      setIsMutating(false);
      setMutatingLabel('');
    }
  };

  const handleConfirmRemove = async () => {
    if (!tenant || !confirm || confirm.kind !== 'remove') return;
    const { member } = confirm;
    try {
      setIsMutating(true);
      setMutatingLabel(`Removendo ${member.email}...`);
      setErrorMsg(null);
      await workspaceMembersService.removeMember(tenant.id, member.id);
      setConfirm(null);
      if (selectedMemberId === member.id) setSelectedMemberId(null);
      await loadMembers();
      onRefreshAudit?.();
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Falha ao remover o membro.');
    } finally {
      setIsMutating(false);
      setMutatingLabel('');
    }
  };

  const handleRoleSelect = (member: WorkspaceMember, role: WorkspaceMemberRole) => {
    if (role === member.role) return;
    setErrorMsg(null);
    setConfirm({ kind: 'role', member, role });
  };

  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-5xl overflow-hidden border-slate-300 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Membros do Workspace</h3>
              <p className="text-xs text-blue-200">
                {tenant.tradeName} • {tenant.name}
                <span className="ml-1.5 font-mono text-blue-300">{tenant.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-3.5 h-3.5" />}
              onClick={() => setInviteOpen(true)}
            >
              Convidar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<KeyRound className="w-3.5 h-3.5" />}
              onClick={() => onImpersonate(tenant)}
              className="!bg-white/10 hover:!bg-white/20 !text-white border-white/20"
            >
              Acessar como Lojista
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[80vh] overflow-hidden">
          {errorMsg && (
            <div className="p-3 bg-red-50 border-b border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-brand-price shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Lista de Membros */}
            <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-surface-border overflow-y-auto max-h-[calc(80vh-57px)]">
              <div className="px-5 py-3 bg-surface-muted/30 flex items-center justify-between">
                <span className="text-xs font-bold text-typography-heading uppercase tracking-wider">
                  Membros ({members.length})
                </span>
                <button
                  onClick={() => loadMembers()}
                  className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Atualizar</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted/60 border-b border-surface-border text-[11px] font-bold text-typography-muted uppercase tracking-wider">
                      <th className="py-3 px-4">Membro</th>
                      <th className="py-3 px-4">Papel</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Inclusão</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-xs">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-typography-muted">
                          Carregando membros...
                        </td>
                      </tr>
                    ) : members.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-typography-muted">
                          Nenhum membro encontrado. Convide o primeiro colaborador.
                        </td>
                      </tr>
                    ) : (
                      members.map((member) => (
                        <tr
                          key={member.id}
                          onClick={() => setSelectedMemberId(member.id)}
                          className={`cursor-pointer transition-colors ${
                            selectedMemberId === member.id
                              ? 'bg-blue-50/60'
                              : 'hover:bg-surface-muted/30'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-bold text-typography-heading">{member.name}</p>
                              <p className="text-[11px] text-typography-muted font-mono">{member.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <select
                              value={member.role}
                              onChange={(e) => handleRoleSelect(member, e.target.value as WorkspaceMemberRole)}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs px-2 py-1 bg-white border border-surface-border rounded-lg text-typography-heading focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                            >
                              <option value="OWNER">Owner</option>
                              <option value="MANAGER">Manager</option>
                              <option value="VIEWER">Viewer</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <StatusBadge status={member.status} />
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="flex items-center gap-1 text-typography-muted">
                              <Clock className="w-3 h-3 text-typography-subtle" />
                              {member.joinedAt}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setErrorMsg(null);
                                setConfirm({ kind: 'remove', member });
                              }}
                              disabled={member.status === 'DISABLED' && member.role !== 'OWNER'}
                              className="p-1.5 rounded text-typography-muted hover:text-brand-price hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Remover membro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Últimas ações de auditoria do membro selecionado */}
            <div className="lg:col-span-4 bg-surface-muted/20 overflow-y-auto max-h-[calc(80vh-57px)]">
              <div className="px-5 py-3 bg-surface-muted/30 flex items-center gap-2 border-b border-surface-border">
                <History className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs font-bold text-typography-heading uppercase tracking-wider">
                  Últimas Ações
                </span>
              </div>

              {!selectedMember ? (
                <div className="p-6 text-center text-xs text-typography-muted">
                  Selecione um membro para ver as ações de auditoria.
                </div>
              ) : auditLoading ? (
                <div className="p-6 text-center text-xs text-typography-muted">
                  Carregando auditoria...
                </div>
              ) : memberAuditLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-typography-muted">
                  <ScrollText className="w-5 h-5 mx-auto mb-2 text-typography-subtle" />
                  Nenhuma ação de auditoria registrada para este membro.
                </div>
              ) : (
                <ul className="divide-y divide-surface-border">
                  {memberAuditLogs.slice(0, 5).map((log) => (
                    <li key={log.id} className="px-5 py-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <AuditActionBadge action={log.action} />
                        <span className="text-[10px] text-typography-muted font-mono shrink-0">
                          {log.createdAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-typography-body leading-relaxed">{log.reason}</p>
                      <p className="text-[10px] text-typography-muted flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-typography-subtle" />
                        {log.adminName}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="p-4 bg-surface-muted/30 border-t border-surface-border text-[10px] text-typography-muted flex items-start gap-1.5">
                <Activity className="w-3 h-3 text-typography-subtle shrink-0 mt-0.5" />
                <span>
                  Última atividade de {selectedMember?.name ?? 'membro'}:{' '}
                  <strong>{selectedMember?.lastActiveAt ?? '—'}</strong>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {inviteOpen && (
        <InviteMemberModal
          tenant={tenant}
          isOpen
          onClose={() => setInviteOpen(false)}
          onInvite={handleInvite}
          isLoading={isInviting}
        />
      )}

      {confirm && (
        <div className="fixed inset-0 z-[60] bg-slate-950/50 flex items-center justify-center p-4 animate-fadeIn">
          <Card className="w-full max-w-md overflow-hidden border-slate-300 shadow-2xl">
            <CardHeader className="flex items-center justify-between py-3.5 bg-surface-muted/30">
              <div className="flex items-center gap-2">
                {confirm.kind === 'remove' ? (
                  <AlertTriangle className="w-4 h-4 text-brand-price" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                )}
                <h4 className="text-xs font-bold text-typography-heading">
                  {confirm.kind === 'remove' ? 'Confirmar Remoção de Membro' : 'Confirmar Alteração de Papel'}
                </h4>
              </div>
              <button
                onClick={() => !isMutating && setConfirm(null)}
                className="p-1 rounded-lg text-typography-muted hover:text-typography-heading hover:bg-surface-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="p-3 rounded-xl bg-surface-muted/60 border border-surface-border text-xs space-y-1">
                <p className="font-bold text-typography-heading">{confirm.member.name}</p>
                <p className="text-typography-muted font-mono">{confirm.member.email}</p>
              </div>

              {confirm.kind === 'role' && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <span className="text-typography-muted">Novo papel</span>
                  <RoleBadge role={confirm.role} />
                </div>
              )}

              {confirm.kind === 'remove' && confirm.member.role === 'OWNER' && (
                <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  Este membro é um OWNER. A remoção será bloqueada caso seja o último OWNER ativo do
                  workspace.
                </p>
              )}

              <div className="pt-3 border-t border-surface-border flex items-center justify-end gap-2.5">
                <Button variant="outline" size="sm" onClick={() => setConfirm(null)} disabled={isMutating}>
                  Cancelar
                </Button>
                {confirm.kind === 'remove' ? (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={handleConfirmRemove}
                    loading={isMutating}
                  >
                    {isMutating ? mutatingLabel : 'Remover Membro'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ShieldCheck className="w-3.5 h-3.5" />}
                    onClick={handleConfirmRole}
                    loading={isMutating}
                  >
                    {isMutating ? mutatingLabel : 'Alterar Papel'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
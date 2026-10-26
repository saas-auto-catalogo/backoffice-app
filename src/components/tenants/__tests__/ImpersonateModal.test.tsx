import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImpersonateModal } from '../ImpersonateModal.js';
import { Tenant } from '../../../types/backoffice.js';

const mockTenant: Tenant = {
  id: 'tenant-001',
  name: 'Empresa Teste Ltda',
  tradeName: 'Concessionária Piloto',
  cnpj: '11.222.333/0001-44',
  city: 'São Paulo',
  state: 'SP',
  plan: 'ENTERPRISE',
  mrr: 1490,
  dmsProvider: 'AutoCerto XML',
  vehiclesCount: 150,
  metaHealthScore: 98,
  status: 'ACTIVE',
  primaryContact: {
    name: 'Contato Teste',
    email: 'teste@empresa.com',
    phone: '11999999999',
  },
  feedToken: 'feed_123',
  createdAt: '2026-01-01',
  lastSyncAt: 'Há 5 minutos',
};

describe('ImpersonateModal', () => {
  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(
      <ImpersonateModal
        tenant={mockTenant}
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar dados do tenant e campos do modal', () => {
    render(
      <ImpersonateModal
        tenant={mockTenant}
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText('Acesso Seguro por Impersonation')).toBeInTheDocument();
    expect(screen.getByText('Concessionária Piloto')).toBeInTheDocument();
    expect(screen.getByText('tenant-001')).toBeInTheDocument();
  });

  it('deve validar tamanho mínimo da justificativa (10 caracteres)', () => {
    const handleConfirm = vi.fn();
    render(
      <ImpersonateModal
        tenant={mockTenant}
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />,
    );

    const textarea = screen.getByPlaceholderText(/descreva o motivo do suporte/i);
    const checkbox = screen.getByRole('checkbox');
    const submitBtn = screen.getByRole('button', { name: /iniciar sessão de impersonation/i });

    // Marcar checkbox
    fireEvent.click(checkbox);

    // Preencher motivo curto (< 10 caracteres)
    fireEvent.change(textarea, { target: { value: 'Suporte' } });

    // O botão deve estar desabilitado ou exibir validação
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/mínimo de 10 caracteres/i)).toBeInTheDocument();

    // Preencher motivo válido (>= 10 caracteres)
    fireEvent.change(textarea, { target: { value: 'Suporte técnico e auditoria de feeds' } });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);
    expect(handleConfirm).toHaveBeenCalledWith(mockTenant, 'Suporte técnico e auditoria de feeds');
  });

  it('deve exibir aviso específico de MFA Obrigatório quando error contiver indicação de 2FA', () => {
    render(
      <ImpersonateModal
        tenant={mockTenant}
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        errorMessage="MFA_REQUIRED: Autenticação de dois fatores obrigatória no backend."
      />,
    );

    expect(screen.getByText(/autenticação de dois fatores \(mfa\/2fa\) obrigatória/i)).toBeInTheDocument();
  });

  it('deve exibir estado de loading no botão quando isLoading for true', () => {
    render(
      <ImpersonateModal
        tenant={mockTenant}
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={true}
      />,
    );

    const submitBtn = screen.getByRole('button', { name: /iniciando/i });
    expect(submitBtn).toBeDisabled();
  });
});

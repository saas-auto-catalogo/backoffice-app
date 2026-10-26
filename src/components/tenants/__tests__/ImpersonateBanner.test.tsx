import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImpersonateBanner } from '../ImpersonateBanner.js';
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

describe('ImpersonateBanner', () => {
  it('deve renderizar os dados do tenant em modo impersonation', () => {
    render(
      <ImpersonateBanner
        tenant={mockTenant}
        onExit={vi.fn()}
      />,
    );

    expect(screen.getByText(/modo de impersonation ativo/i)).toBeInTheDocument();
    expect(screen.getByText('Concessionária Piloto')).toBeInTheDocument();
  });

  it('deve chamar window.open com a URL correta e token ao clicar no botão de abrir frontend', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <ImpersonateBanner
        tenant={mockTenant}
        token="token_impersonation_jwt_999"
        onExit={vi.fn()}
      />,
    );

    const openLink = screen.getByRole('button', { name: /abrir frontend do lojista/i });
    fireEvent.click(openLink);

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('impersonate_token=token_impersonation_jwt_999'),
      '_blank',
    );
  });

  it('deve disparar onExit ao clicar em Encerrar Impersonation', () => {
    const handleExit = vi.fn();
    render(
      <ImpersonateBanner
        tenant={mockTenant}
        onExit={handleExit}
      />,
    );

    const exitBtn = screen.getByRole('button', { name: /encerrar impersonation/i });
    fireEvent.click(exitBtn);

    expect(handleExit).toHaveBeenCalledTimes(1);
  });
});

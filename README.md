# DriveSync — Backoffice App (Super Admin)

[![CI](https://github.com/saas-auto-catalogo/backoffice-app/actions/workflows/ci.yml/badge.svg)](https://github.com/saas-auto-catalogo/backoffice-app/actions/workflows/ci.yml)

Painel operacional exclusivo da equipe SaaS: suporte a clientes, governança de tenants, telemetria de feeds e moderação de conteúdo IA.

**Wiki:** [backoffice-app](https://github.com/saas-auto-catalogo/.github/blob/main/docs/wiki/backoffice-app.md)

---

## Stack

- React 18 + TypeScript 5.7
- Vite 6
- Tailwind CSS 3.4 + Lucide Icons

> O painel do **lojista** está no repositório `frontend-app`. Este app é apenas para usuários com role `SUPER_ADMIN`.

---

## Módulos planejados

- **Gestão global de tenants** — workspaces, planos, faturamento, impersonation com audit log
- **Painel de feeds XML** — erros de parsing, feeds offline, re-sync forçado
- **Central de moderação do blog** — aprovação de artigos do `ai-content-worker`
- **Métricas SaaS** — MRR, ARR, churn, veículos ativos no Meta

---

## Execução local

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

Consome a mesma `backend-api` com credenciais de Super Admin (criadas no seed do backend).

---

## Documentação

- [Multi-tenancy e RBAC](https://github.com/saas-auto-catalogo/.github/blob/main/docs/specs/multi-tenancy-rbac-specification.md)
- [backend-api wiki](https://github.com/saas-auto-catalogo/.github/blob/main/docs/wiki/backend-api.md)

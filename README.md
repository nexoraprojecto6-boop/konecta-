# KONECTA

Plataforma para Angola e Moçambique que conecta pessoas a serviços, profissionais, empresas, empregos, produtos, marketplace, entregas, transporte e oportunidades próximas da localização do utilizador.

> **Status:** Fase 1 — Fundação da arquitetura. Nenhuma funcionalidade de negócio (login, OTP, GPS, marketplace, pagamentos, delivery, chat) foi implementada ainda.

## Stack

- **Backend:** Node.js, TypeScript, NestJS, PostgreSQL + PostGIS, Prisma, Redis, BullMQ, Socket.IO
- **Mobile:** React Native + Expo + TypeScript
- **Admin:** Next.js + React + TypeScript
- **Infra:** Docker, GitHub Actions, pnpm workspaces (monorepo)

## Estrutura do monorepo

```
konecta/
├── apps/
│   ├── api/       -> Backend NestJS (único ponto de acesso ao PostgreSQL e Redis)
│   ├── mobile/    -> Aplicativo Expo (Android/iOS)
│   └── admin/     -> Painel administrativo (Next.js)
├── packages/
│   ├── config/       -> configurações compartilhadas
│   ├── types/        -> tipos TypeScript compartilhados
│   ├── validation/   -> schemas de validação compartilhados
│   └── eslint-config/-> configuração de lint compartilhada
├── prisma/        -> schema e migrations (centralizado)
├── docker/        -> arquivos auxiliares de infraestrutura (init.sql, etc.)
├── docker-compose.yml
└── docs/
```

## Pré-requisitos

- Node.js >= 18.18
- pnpm >= 8
- Docker e Docker Compose

## Como iniciar (Fase 1)

1. Instalar dependências:
   ```
   pnpm install
   ```
2. Copiar os arquivos `.env.example` para `.env` (raiz, `apps/api`, `apps/mobile`, `apps/admin`) e ajustar valores.
3. Subir PostgreSQL (com PostGIS) e Redis:
   ```
   pnpm docker:up
   ```
4. Gerar o Prisma Client:
   ```
   pnpm prisma:generate
   ```
5. Rodar a primeira migration:
   ```
   pnpm prisma:migrate:dev
   ```
6. Iniciar a API:
   ```
   pnpm dev:api
   ```
7. (Opcional) Iniciar o admin:
   ```
   pnpm dev:admin
   ```
8. (Opcional) Iniciar o mobile:
   ```
   pnpm dev:mobile
   ```

Mais detalhes em `docs/SETUP.md` e `docs/ARCHITECTURE.md`.

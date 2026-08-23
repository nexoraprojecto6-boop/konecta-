# Arquitetura — KONECTA (Fase 1)

## Visão geral

Monorepo gerenciado com **pnpm workspaces** (sem Turborepo nesta fase), contendo três aplicações e quatro pacotes compartilhados.

## Aplicações

- **apps/api** — Backend NestJS. Monólito modular (não microserviços). Único componente com acesso direto ao PostgreSQL (via Prisma) e ao Redis (via ioredis/BullMQ).
- **apps/mobile** — App Expo/React Native. Consome apenas a API via HTTP (fetch nativo). Sem autenticação, GPS ou marketplace nesta fase.
- **apps/admin** — Painel Next.js. Consome apenas a API via HTTP (fetch nativo).

## Pacotes compartilhados

- **packages/types** — tipos TypeScript compartilhados (ex: `HealthStatus`, `ApiResponse`).
- **packages/validation** — schemas Zod compartilhados (ex: validação de env).
- **packages/config** — constantes e configurações compartilhadas.
- **packages/eslint-config** — regras de lint compartilhadas.

## Banco de dados

- PostgreSQL com extensão **PostGIS** habilitada (preparado para localização geoespacial em fases futuras).
- Schema Prisma centralizado em `prisma/schema.prisma`, sem models de negócio nesta fase.
- Migrations centralizadas em `prisma/migrations/`.

## Redis

- Usado para cache, filas (BullMQ) e, futuramente, dados de tempo real. Nenhuma fila ou job implementado ainda nesta fase.

## Comunicação entre componentes

- `mobile` → `api`: HTTP (fetch), futuramente WebSocket.
- `admin` → `api`: HTTP (fetch).
- `api` → `postgres`: Prisma Client.
- `api` → `redis`: ioredis / BullMQ.
- Nenhuma aplicação além da API tem credenciais de banco de dados ou Redis.

## Segurança

- Nenhum secret versionado no Git; apenas arquivos `.env.example`.
- Validação de variáveis de ambiente na inicialização da API (fail-fast).
- CORS restrito por variável de ambiente.

## O que NÃO existe ainda (por decisão explícita)

- Login / autenticação / OTP
- Localização em tempo real / GPS
- Marketplace, pagamentos, delivery, chat, empregos, profissionais, empresas
- Notificações
- Deploy automatizado (CD)
- Microserviços

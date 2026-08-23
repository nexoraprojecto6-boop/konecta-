# Setup — KONECTA (Fase 1)

## 1. Pré-requisitos

- Node.js >= 18.18
- pnpm >= 8 (`npm install -g pnpm`)
- Docker + Docker Compose

## 2. Clonar e instalar

```
pnpm install
```

## 3. Configurar variáveis de ambiente

Copiar cada `.env.example` para `.env`:

- `konecta/.env.example` → `konecta/.env`
- `konecta/apps/api/.env.example` → `konecta/apps/api/.env`
- `konecta/apps/mobile/.env.example` → `konecta/apps/mobile/.env`
- `konecta/apps/admin/.env.example` → `konecta/apps/admin/.env`

## 4. Subir infraestrutura (Postgres + Redis)

```
pnpm docker:up
```

## 5. Prisma

```
pnpm prisma:generate
pnpm prisma:migrate:dev
```

## 6. Rodar as aplicações

```
pnpm dev:api
pnpm dev:admin
pnpm dev:mobile
```

## 7. Encerrar infraestrutura

```
pnpm docker:down
```

# Dockerfile de produção da API KONECTA.
# O build deve ser feito a partir da RAIZ do monorepo (contexto completo
# necessário, já que a API depende de packages/* e prisma/ compartilhados).
# No Railway: Root Directory = raiz do repo, Dockerfile Path = apps/api/Dockerfile

FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
WORKDIR /repo

# ---- Estágio 1: instalar dependências (usa cache se só o código mudar) ----
FROM base AS deps
COPY .npmrc pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/config/package.json packages/config/
COPY packages/types/package.json packages/types/
COPY packages/validation/package.json packages/validation/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile

# ---- Estágio 2: build (packages compartilhados + prisma generate + API) ----
FROM deps AS build
COPY packages ./packages
COPY prisma ./prisma
COPY apps/api ./apps/api
RUN pnpm --filter "./packages/**" build
RUN pnpm --filter @konecta/api exec prisma generate --schema=../../prisma/schema.prisma
RUN pnpm --filter @konecta/api build

# ---- Estágio 3: runtime (só o necessário para produção) ----
FROM node:20-slim AS runtime
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
WORKDIR /repo
ENV NODE_ENV=production

COPY --from=build /repo/.npmrc /repo/pnpm-workspace.yaml /repo/pnpm-lock.yaml /repo/package.json ./
COPY --from=build /repo/packages ./packages
COPY --from=build /repo/prisma ./prisma
COPY --from=build /repo/apps/api ./apps/api
RUN pnpm install --frozen-lockfile --prod

EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]

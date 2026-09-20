FROM node:20-slim AS base
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends python3 make g++ openssl && \
    rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
WORKDIR /repo

FROM base AS deps
COPY .npmrc pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/config/package.json packages/config/
COPY packages/types/package.json packages/types/
COPY packages/validation/package.json packages/validation/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY packages ./packages
COPY prisma ./prisma
COPY apps/api ./apps/api
RUN pnpm --filter "./packages/**" build
RUN pnpm --filter @konecta/api exec prisma generate --schema=../../prisma/schema.prisma
RUN pnpm --filter @konecta/api build

FROM node:20-slim AS runtime
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends python3 make g++ openssl && \
    rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
WORKDIR /repo
ENV NODE_ENV=production

COPY --from=build /repo/.npmrc /repo/pnpm-workspace.yaml /repo/pnpm-lock.yaml /repo/package.json ./
COPY --from=build /repo/packages ./packages
COPY --from=build /repo/prisma ./prisma
COPY --from=build /repo/apps/api ./apps/api
RUN pnpm install --frozen-lockfile
RUN chmod +x apps/api/docker-entrypoint.sh

EXPOSE 3000
CMD ["sh", "apps/api/docker-entrypoint.sh"]

#!/bin/sh
set -e

echo "Aplicando migrations..."
pnpm --filter @konecta/api exec prisma migrate deploy --schema=../../prisma/schema.prisma

echo "Aplicando seed de categorias (seguro rodar repetidas vezes)..."
pnpm --filter @konecta/api exec prisma db execute --schema=../../prisma/schema.prisma --file=../../prisma/seed.sql

echo "Iniciando API..."
exec node apps/api/dist/main.js

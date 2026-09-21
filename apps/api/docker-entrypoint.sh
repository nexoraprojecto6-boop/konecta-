#!/bin/sh
set -e

echo "Aplicando migrations..."
pnpm --filter @konecta/api exec prisma migrate deploy --schema=../../prisma/schema.prisma

if [ -f "../../prisma/seed.sql" ]; then
  echo "Aplicando seed de categorias (seguro rodar repetidas vezes)..."
  pnpm --filter @konecta/api exec prisma db execute --schema=../../prisma/schema.prisma --file=../../prisma/seed.sql
else
  echo "Nenhum seed.sql encontrado, a saltar este passo."
fi

echo "Verificando bootstrap de admin..."
node apps/api/scripts/bootstrap-admin.js

echo "Iniciando API..."
exec node apps/api/dist/main.js

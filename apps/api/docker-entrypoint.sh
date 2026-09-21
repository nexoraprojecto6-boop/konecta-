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
node -e "
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

(async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;
  const region = process.env.ADMIN_REGION || 'AO';

  if (!email || !password || !name) {
    console.log('ADMIN_EMAIL/ADMIN_PASSWORD/ADMIN_NAME nao definidos, a saltar bootstrap de admin.');
    return;
  }

  const prisma = new PrismaClient();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (!existing.isAdmin) {
      await prisma.user.update({ where: { email }, data: { isAdmin: true } });
      console.log('Utilizador ' + email + ' ja existia, promovido a admin.');
    } else {
      console.log('Utilizador ' + email + ' ja e admin, nada a fazer.');
    }
  } else {
    const passwordHash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, region, isAdmin: true },
    });
    console.log('Admin criado: ' + user.email);
  }

  await prisma.\$disconnect();
})().catch((err) => {
  console.error('Erro no bootstrap de admin:', err);
  process.exit(1);
});
"

echo "Iniciando API..."
exec node apps/api/dist/main.js

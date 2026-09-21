const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;
  const region = process.env.ADMIN_REGION || "AO";

  if (!email || !password || !name) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD/ADMIN_NAME não definidos, a saltar bootstrap de admin.");
    return;
  }

  const prisma = new PrismaClient();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.isAdmin) {
      await prisma.user.update({
        where: { email },
        data: { isAdmin: true },
      });
      console.log(`Utilizador ${email} já existia — promovido a admin.`);
    } else {
      console.log(`Utilizador ${email} já é admin, nada a fazer.`);
    }
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, region, isAdmin: true },
  });

  console.log(`Admin criado: ${user.email}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Erro no bootstrap de admin:", err);
  process.exit(1);
});

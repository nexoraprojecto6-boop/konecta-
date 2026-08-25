import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/**
 * Módulo global do Prisma — evita precisar importar PrismaModule
 * em todo módulo de negócio que precisar acessar o banco.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

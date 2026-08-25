import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * Wrapper injetável do PrismaClient.
 * Único ponto de acesso ao PostgreSQL dentro da API, conforme a
 * arquitetura definida na Fase 1 (mobile/admin nunca acessam o banco
 * diretamente, sempre via API).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log("Conectado ao PostgreSQL via Prisma");
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

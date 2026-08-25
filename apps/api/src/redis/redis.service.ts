import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

/**
 * Wrapper injetável do cliente Redis (ioredis).
 * Único ponto de acesso ao Redis dentro da API, usado nesta fase
 * para armazenar sessões de refresh token com TTL.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public client!: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const url = this.configService.get<string>("REDIS_URL");
    this.client = new Redis(url as string, {
      lazyConnect: false,
    });
    this.client.on("error", (err) => {
      this.logger.error(`Erro de conexão com o Redis: ${err.message}`);
    });
    this.logger.log("Conectado ao Redis");
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}

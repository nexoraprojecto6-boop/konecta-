import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>("CORS_ORIGIN");
  if (corsOrigin) {
    app.enableCors({ origin: corsOrigin });
  }

  const port = configService.get<number>("PORT") ?? 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`[KONECTA API] Rodando na porta ${port}`);
}

bootstrap();

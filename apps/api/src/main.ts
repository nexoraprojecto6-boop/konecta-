import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>("CORS_ORIGIN");
  if (corsOrigin) {
    const allowedOrigins = corsOrigin.split(",").map((origin) => origin.trim());
    app.enableCors({ origin: allowedOrigins });
  }

  const port = configService.get<number>("PORT") ?? 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`[KONECTA API] Rodando na porta ${port}`);
}

bootstrap();

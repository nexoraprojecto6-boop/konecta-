import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { validate } from "./config/env.validation";
import { HealthModule } from "./modules/health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProfessionalsModule } from "./modules/professionals/professionals.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { ServicesModule } from "./modules/services/services.module";
import { DiscoveryModule } from "./modules/discovery/discovery.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    // Limite padrão global (mais permissivo); os endpoints de auth
    // sobrescrevem isso com @Throttle() para um limite mais restrito.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    RedisModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProfessionalsModule,
    CompaniesModule,
    ServicesModule,
    DiscoveryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

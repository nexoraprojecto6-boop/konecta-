import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../../prisma/prisma.service";
import type { JwtPayload } from "../interfaces/jwt-payload.interface";
import type { User } from "@konecta/types";

/**
 * Estratégia Passport que valida o access token JWT em cada requisição
 * protegida. Busca o usuário no banco para garantir que ele ainda existe
 * (não confia cegamente no conteúdo do token).
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") as string,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Nunca repassar passwordHash adiante, nem para o objeto `request.user`.
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      region: user.region,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

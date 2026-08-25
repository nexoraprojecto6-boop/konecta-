import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { randomBytes, randomUUID, createHash } from "crypto";
import ms from "ms";
import type { User, AuthResponse, AuthTokens } from "@konecta/types";
import type { RegisterInput, LoginInput } from "@konecta/validation";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

interface StoredSession {
  userId: string;
  secretHash: string;
}

const SESSION_KEY_PREFIX = "auth:session:";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterInput): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      // Diferente do login, o cadastro pode informar que o email já
      // está em uso — não há problema de segurança em revelar isso aqui.
      throw new ConflictException("Este email já está em uso");
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        region: dto.region,
      },
    });

    const tokens = await this.issueTokens(user.id);

    return { user: this.toPublicUser(user), tokens };
  }

  async login(dto: LoginInput): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Mensagem idêntica para "email não existe" e "senha incorreta",
    // para não revelar se um email está cadastrado na plataforma.
    const invalidCredentials = () =>
      new UnauthorizedException("Credenciais inválidas");

    if (!user) {
      throw invalidCredentials();
    }

    const passwordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!passwordValid) {
      throw invalidCredentials();
    }

    const tokens = await this.issueTokens(user.id);

    return { user: this.toPublicUser(user), tokens };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const session = await this.consumeSession(refreshToken);

    if (!session) {
      throw new UnauthorizedException("Sessão inválida ou expirada");
    }

    // Rotação: a sessão antiga já foi removida em consumeSession;
    // emitimos um novo par de tokens.
    return this.issueTokens(session.userId);
  }

  async logout(refreshToken: string): Promise<void> {
    // Logout é idempotente e silencioso: não revela se o token era
    // válido, expirado, ou inexistente. Sempre tenta invalidar a sessão
    // correspondente, se ela existir e o segredo bater.
    await this.consumeSession(refreshToken);
  }

  /**
   * Gera um novo access token (JWT de curta duração) e um novo refresh
   * token (opaco, armazenado com hash no Redis com TTL obrigatório).
   */
  private async issueTokens(userId: string): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get<string>("JWT_SECRET"),
        expiresIn: this.configService.get<string>("JWT_ACCESS_TTL"),
      },
    );

    const sessionId = randomUUID();
    const secret = randomBytes(32).toString("hex");
    const secretHash = this.hashSecret(secret);

    const refreshTtl = this.configService.get<string>("JWT_REFRESH_TTL");
    const ttlSeconds = Math.floor(ms(refreshTtl as ms.StringValue) / 1000);

    const session: StoredSession = { userId, secretHash };

    await this.redis.client.set(
      `${SESSION_KEY_PREFIX}${sessionId}`,
      JSON.stringify(session),
      "EX",
      ttlSeconds,
    );

    const refreshToken = `${sessionId}.${secret}`;

    return { accessToken, refreshToken };
  }

  /**
   * Valida um refresh token e, se válido, remove a sessão correspondente
   * do Redis (a sessão é de uso único — cada refresh emite uma nova).
   * Retorna null se o token for malformado, inexistente ou o segredo
   * não corresponder.
   */
  private async consumeSession(
    refreshToken: string,
  ): Promise<StoredSession | null> {
    const parsed = this.parseRefreshToken(refreshToken);
    if (!parsed) {
      return null;
    }

    const key = `${SESSION_KEY_PREFIX}${parsed.sessionId}`;
    const raw = await this.redis.client.get(key);
    if (!raw) {
      return null;
    }

    let stored: StoredSession;
    try {
      stored = JSON.parse(raw) as StoredSession;
    } catch {
      await this.redis.client.del(key);
      return null;
    }

    const secretHash = this.hashSecret(parsed.secret);
    if (secretHash !== stored.secretHash) {
      return null;
    }

    await this.redis.client.del(key);
    return stored;
  }

  private parseRefreshToken(
    token: string,
  ): { sessionId: string; secret: string } | null {
    const separatorIndex = token.indexOf(".");
    if (separatorIndex <= 0 || separatorIndex === token.length - 1) {
      return null;
    }

    const sessionId = token.slice(0, separatorIndex);
    const secret = token.slice(separatorIndex + 1);
    return { sessionId, secret };
  }

  private hashSecret(secret: string): string {
    return createHash("sha256").update(secret).digest("hex");
  }

  /**
   * Converte o model do Prisma para a representação pública do usuário.
   * NUNCA inclui passwordHash.
   */
  private toPublicUser(user: {
    id: string;
    email: string;
    name: string;
    region: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
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

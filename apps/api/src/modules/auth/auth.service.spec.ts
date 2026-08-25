import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

describe("AuthService", () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };
  let redisClient: { set: jest.Mock; get: jest.Mock; del: jest.Mock };

  const configValues: Record<string, string> = {
    JWT_SECRET: "test_secret_with_at_least_32_characters_long",
    JWT_ACCESS_TTL: "15m",
    JWT_REFRESH_TTL: "7d",
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    redisClient = {
      set: jest.fn().mockResolvedValue("OK"),
      get: jest.fn(),
      del: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: RedisService, useValue: { client: redisClient } },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue("fake.jwt.token"),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string) => configValues[key]) },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it("register: cria usuário com senha hasheada (nunca em texto puro)", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(
      ({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({
          id: "user-1",
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    );

    const result = await service.register({
      email: "ana@konecta.test",
      password: "senha1234",
      name: "Ana",
      region: "AO",
    });

    expect(result.user.email).toBe("ana@konecta.test");
    expect((result.user as unknown as Record<string, unknown>).passwordHash).toBeUndefined();

    const passedHash = prisma.user.create.mock.calls[0][0].data.passwordHash;
    expect(passedHash).not.toBe("senha1234");
    expect(passedHash.startsWith("$argon2id$")).toBe(true);
  });

  it("register: rejeita email duplicado", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "existing" });

    await expect(
      service.register({
        email: "ana@konecta.test",
        password: "senha1234",
        name: "Ana",
        region: "AO",
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("login: rejeita email inexistente com mensagem genérica", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: "naoexiste@konecta.test", password: "x" }),
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("login: rejeita senha incorreta com a MESMA mensagem genérica do email inexistente", async () => {
    const hash = await argon2.hash("senhacorreta1", { type: argon2.argon2id });
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "ana@konecta.test",
      passwordHash: hash,
      name: "Ana",
      region: "AO",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.login({ email: "ana@konecta.test", password: "senhaerrada1" }),
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("login: sucesso retorna tokens e usuário sem passwordHash", async () => {
    const hash = await argon2.hash("senhacorreta1", { type: argon2.argon2id });
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "ana@konecta.test",
      passwordHash: hash,
      name: "Ana",
      region: "AO",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.login({
      email: "ana@konecta.test",
      password: "senhacorreta1",
    });

    expect(result.tokens.accessToken).toBe("fake.jwt.token");
    expect(result.tokens.refreshToken).toContain(".");
    expect((result.user as unknown as Record<string, unknown>).passwordHash).toBeUndefined();
  });

  it("refresh: rejeita token malformado", async () => {
    await expect(service.refresh("token-sem-ponto")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("refresh: rejeita sessão inexistente no Redis", async () => {
    redisClient.get.mockResolvedValue(null);

    await expect(
      service.refresh("algum-session-id.algum-segredo"),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("logout: nunca lança erro, mesmo com token inválido (idempotente)", async () => {
    redisClient.get.mockResolvedValue(null);
    await expect(service.logout("token-invalido")).resolves.toBeUndefined();
  });
});

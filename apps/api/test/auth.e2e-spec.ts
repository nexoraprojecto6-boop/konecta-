import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

/**
 * Testes e2e do fluxo completo de autenticação.
 * Requer DATABASE_URL/REDIS_URL configurados (ex: via `pnpm docker:up`)
 * e o Prisma Client já gerado (`pnpm prisma:generate`).
 */
describe("Auth (e2e)", () => {
  let app: INestApplication;
  const email = `e2e-${Date.now()}@konecta.test`;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /auth/register - cria usuário e retorna tokens", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "senha1234", name: "Teste E2E", region: "AO" })
      .expect(201);

    expect(res.body.user.email).toBe(email);
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.tokens.accessToken).toBeDefined();
    expect(res.body.tokens.refreshToken).toBeDefined();
  });

  it("POST /auth/register - rejeita email duplicado", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "senha1234", name: "Teste E2E", region: "AO" })
      .expect(409);
  });

  it("POST /auth/register - rejeita senha inválida (sem número)", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email: `outro-${Date.now()}@konecta.test`,
        password: "senhasemnumero",
        name: "Teste",
        region: "AO",
      })
      .expect(400);
  });

  it("POST /auth/login - rejeita senha incorreta", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: "senhaerrada1" })
      .expect(401);
  });

  it("POST /auth/login - sucesso retorna tokens", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: "senha1234" })
      .expect(200);

    accessToken = res.body.tokens.accessToken;
    refreshToken = res.body.tokens.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("GET /users/me - sem token retorna 401", async () => {
    await request(app.getHttpServer()).get("/users/me").expect(401);
  });

  it("GET /users/me - com token válido retorna o usuário, sem passwordHash", async () => {
    const res = await request(app.getHttpServer())
      .get("/users/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.email).toBe(email);
    expect(res.body.passwordHash).toBeUndefined();
  });

  it("POST /auth/refresh - token válido gera novo par e rotaciona", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).not.toBe(refreshToken);
    refreshToken = res.body.refreshToken;
  });

  it("POST /auth/refresh - token já usado (rotacionado) é rejeitado", async () => {
    await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken: "sessao-antiga.segredo-antigo" })
      .expect(401);
  });

  it("POST /auth/logout - invalida a sessão", async () => {
    await request(app.getHttpServer())
      .post("/auth/logout")
      .send({ refreshToken })
      .expect(204);

    await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(401);
  });

  it("Rate limiting - bloqueia após muitas tentativas de login", async () => {
    const attempts = Array.from({ length: 6 }).map(() =>
      request(app.getHttpServer())
        .post("/auth/login")
        .send({ email, password: "senhaerrada1" }),
    );
    const results = await Promise.all(attempts);
    const tooManyRequests = results.some((r) => r.status === 429);
    expect(tooManyRequests).toBe(true);
  });
});

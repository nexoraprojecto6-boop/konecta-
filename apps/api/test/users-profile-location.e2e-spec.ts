import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

/**
 * Testes e2e de perfil e localização (Fase 3).
 * Requer DATABASE_URL/REDIS_URL configurados e o Prisma Client gerado.
 */
describe("Perfil e Localização (e2e)", () => {
  let app: INestApplication;
  const emailA = `perfil-a-${Date.now()}@konecta.test`;
  const emailB = `perfil-b-${Date.now()}@konecta.test`;
  let tokenA: string;
  let tokenB: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const resA = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: emailA, password: "senha1234", name: "Usuário A", region: "AO" });
    tokenA = resA.body.tokens.accessToken;

    const resB = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: emailB, password: "senha1234", name: "Usuário B", region: "MZ" });
    tokenB = resB.body.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it("PATCH /users/me atualiza o nome", async () => {
    const res = await request(app.getHttpServer())
      .patch("/users/me")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Usuário A Editado" })
      .expect(200);

    expect(res.body.name).toBe("Usuário A Editado");
    expect(res.body.passwordHash).toBeUndefined();
  });

  it("PATCH /users/me com corpo vazio é rejeitado", async () => {
    await request(app.getHttpServer())
      .patch("/users/me")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({})
      .expect(400);
  });

  it("PATCH /users/me com region inválida é rejeitado", async () => {
    await request(app.getHttpServer())
      .patch("/users/me")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ region: "BR" })
      .expect(400);
  });

  it("GET /users/me/location antes de configurar retorna campos nulos (200)", async () => {
    const res = await request(app.getHttpServer())
      .get("/users/me/location")
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);

    expect(res.body.province).toBeNull();
  });

  it("PATCH /users/me/location com apenas latitude (sem longitude) é rejeitado", async () => {
    await request(app.getHttpServer())
      .patch("/users/me/location")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ province: "Luanda", city: "Luanda", latitude: -8.8 })
      .expect(400);
  });

  it("PATCH /users/me/location com latitude fora do intervalo é rejeitado", async () => {
    await request(app.getHttpServer())
      .patch("/users/me/location")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ province: "Luanda", city: "Luanda", latitude: 200, longitude: 10 })
      .expect(400);
  });

  it("PATCH /users/me/location cria a localização corretamente", async () => {
    const res = await request(app.getHttpServer())
      .patch("/users/me/location")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ province: "Luanda", city: "Luanda", latitude: -8.839, longitude: -13.2894 })
      .expect(200);

    expect(res.body.province).toBe("Luanda");
    expect(res.body.latitude).toBeCloseTo(-8.839, 3);
    expect(res.body.longitude).toBeCloseTo(-13.2894, 3);
  });

  it("usuário B não consegue ver a localização do usuário A (isolamento por token)", async () => {
    const res = await request(app.getHttpServer())
      .get("/users/me/location")
      .set("Authorization", `Bearer ${tokenB}`)
      .expect(200);

    // B nunca configurou localização própria — deve continuar vazio,
    // nunca deve retornar o que A configurou.
    expect(res.body.province).toBeNull();
  });

  it("DELETE /users/me/location remove a localização", async () => {
    await request(app.getHttpServer())
      .delete("/users/me/location")
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(204);

    const res = await request(app.getHttpServer())
      .get("/users/me/location")
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);

    expect(res.body.province).toBeNull();
  });

  it("todos os endpoints de perfil/localização exigem token (401 sem ele)", async () => {
    await request(app.getHttpServer()).patch("/users/me").send({ name: "X" }).expect(401);
    await request(app.getHttpServer()).get("/users/me/location").expect(401);
    await request(app.getHttpServer()).patch("/users/me/location").send({}).expect(401);
    await request(app.getHttpServer()).delete("/users/me/location").expect(401);
  });
});

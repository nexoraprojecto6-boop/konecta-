import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

/**
 * Testes e2e do KONECTA Discovery (Fase 4): categorias, perfil
 * profissional, empresa, serviços e busca por proximidade.
 * Requer DATABASE_URL/REDIS_URL configurados e o Prisma Client gerado.
 */
describe("Discovery (e2e)", () => {
  let app: INestApplication;
  const emailProf = `discovery-prof-${Date.now()}@konecta.test`;
  const emailComp = `discovery-comp-${Date.now()}@konecta.test`;
  let tokenProf: string;
  let tokenComp: string;
  let companyId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const resProf = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: emailProf, password: "senha1234", name: "Profissional Teste", region: "AO" });
    tokenProf = resProf.body.tokens.accessToken;

    const resComp = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: emailComp, password: "senha1234", name: "Dono Empresa", region: "AO" });
    tokenComp = resComp.body.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /categories retorna lista pública", async () => {
    const res = await request(app.getHttpServer()).get("/categories").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /categories sem ser admin é rejeitado (403)", async () => {
    await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${tokenProf}`)
      .send({ name: "Categoria Teste", slug: `teste-${Date.now()}` })
      .expect(403);
  });

  it("POST /professionals/me cria o perfil profissional", async () => {
    const res = await request(app.getHttpServer())
      .post("/professionals/me")
      .set("Authorization", `Bearer ${tokenProf}`)
      .send({
        profession: "Mecânico",
        province: "Benguela",
        city: "Benguela",
        latitude: -12.5763,
        longitude: 13.4055,
      })
      .expect(201);

    expect(res.body.profession).toBe("Mecânico");
  });

  it("POST /professionals/me duplicado é rejeitado (409)", async () => {
    await request(app.getHttpServer())
      .post("/professionals/me")
      .set("Authorization", `Bearer ${tokenProf}`)
      .send({ profession: "Outro" })
      .expect(409);
  });

  it("PATCH /professionals/me de outro usuário é impossível (usa sempre o próprio token)", async () => {
    // Não há endpoint que aceite userId externo — o teste confirma que
    // o token de A não pode nunca afetar o perfil de B (implicitamente,
    // já que updateMe sempre usa req.user.id).
    const res = await request(app.getHttpServer())
      .patch("/professionals/me")
      .set("Authorization", `Bearer ${tokenComp}`) // usuário SEM perfil profissional
      .send({ bio: "Tentativa" })
      .expect(404); // não tem perfil próprio — nunca afeta o de outro usuário
    expect(res.body).toBeDefined();
  });

  it("POST /companies cria a empresa como PENDING e o criador vira owner", async () => {
    const res = await request(app.getHttpServer())
      .post("/companies")
      .set("Authorization", `Bearer ${tokenComp}`)
      .send({ tradeName: "Auto Center E2E", legalName: "Auto Center E2E Lda" })
      .expect(201);

    companyId = res.body.id;
    expect(res.body.verificationStatus).toBe("PENDING");
  });

  it("PATCH /companies/:id/verification sem ser admin é rejeitado (403)", async () => {
    await request(app.getHttpServer())
      .patch(`/companies/${companyId}/verification`)
      .set("Authorization", `Bearer ${tokenComp}`) // é o dono, mas não é admin
      .send({ verificationStatus: "VERIFIED" })
      .expect(403);
  });

  it("PATCH /companies/:id por quem não é membro é rejeitado (403)", async () => {
    await request(app.getHttpServer())
      .patch(`/companies/${companyId}`)
      .set("Authorization", `Bearer ${tokenProf}`) // não é membro desta empresa
      .send({ tradeName: "Hackeado" })
      .expect(403);
  });

  it("POST /services rejeita quando nenhum proprietário é informado", async () => {
    await request(app.getHttpServer())
      .post("/services")
      .set("Authorization", `Bearer ${tokenProf}`)
      .send({ name: "Serviço sem dono", categoryId: "00000000-0000-0000-0000-000000000000" })
      .expect(400);
  });

  it("POST /services rejeita quando os dois proprietários são informados", async () => {
    await request(app.getHttpServer())
      .post("/services")
      .set("Authorization", `Bearer ${tokenProf}`)
      .send({
        name: "Serviço com dois donos",
        categoryId: "00000000-0000-0000-0000-000000000000",
        professionalProfileId: "qualquer",
        companyId: "qualquer",
      })
      .expect(400);
  });

  it("GET /discovery/search exige lat/lng (400 sem eles)", async () => {
    await request(app.getHttpServer()).get("/discovery/search").expect(400);
  });

  it("GET /discovery/search não retorna coordenadas exatas de terceiros", async () => {
    const res = await request(app.getHttpServer())
      .get("/discovery/search")
      .query({ lat: -12.577, lng: 13.404, radiusKm: 5 })
      .expect(200);

    for (const item of res.body.items) {
      expect(item.geoLocation).toBeUndefined();
      expect(item.latitude).toBeUndefined();
      expect(item.longitude).toBeUndefined();
      expect(typeof item.distanceKm).toBe("number");
    }
  });
});

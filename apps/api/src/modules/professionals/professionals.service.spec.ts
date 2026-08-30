import { Test } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { ProfessionalsService } from "./professionals.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("ProfessionalsService", () => {
  let service: ProfessionalsService;
  let prisma: {
    professionalProfile: { findUnique: jest.Mock };
    $queryRaw: jest.Mock;
    $executeRaw: jest.Mock;
  };

  const row = {
    userId: "user-1",
    name: "Pedro",
    profession: "Mecânico",
    bio: null,
    radiusKm: 10,
    phone: null,
    whatsapp: null,
    province: "Benguela",
    city: "Benguela",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      professionalProfile: { findUnique: jest.fn() },
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [ProfessionalsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(ProfessionalsService);
  });

  it("findByUserId lança NotFoundException quando não existe", async () => {
    prisma.$queryRaw.mockResolvedValue([]);
    await expect(service.findByUserId("user-1")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("findByUserId retorna o perfil quando existe", async () => {
    prisma.$queryRaw.mockResolvedValue([row]);
    const result = await service.findByUserId("user-1");
    expect(result.profession).toBe("Mecânico");
  });

  it("create rejeita se já existir perfil (CONFLICT)", async () => {
    prisma.professionalProfile.findUnique.mockResolvedValue(row);
    await expect(
      service.create("user-1", { profession: "Mecânico" }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("create com sucesso insere e retorna o perfil", async () => {
    prisma.professionalProfile.findUnique.mockResolvedValue(null);
    prisma.$queryRaw.mockResolvedValue([row]);
    const result = await service.create("user-1", { profession: "Mecânico" });
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
    expect(result.userId).toBe("user-1");
  });

  it("update rejeita perfil inexistente", async () => {
    prisma.professionalProfile.findUnique.mockResolvedValue(null);
    await expect(
      service.update("user-1", { bio: "Novo bio" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

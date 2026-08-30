import { Test } from "@nestjs/testing";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("ServicesService", () => {
  let service: ServicesService;
  let prisma: {
    service: {
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      findUnique: jest.Mock;
    };
    professionalProfile: { findUnique: jest.Mock };
    companyMember: { findUnique: jest.Mock };
  };

  const baseService = {
    id: "svc-1",
    name: "Diagnóstico",
    description: null,
    categoryId: "cat-1",
    professionalProfileId: "user-1",
    companyId: null,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      service: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
      professionalProfile: { findUnique: jest.fn() },
      companyMember: { findUnique: jest.fn() },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [ServicesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(ServicesService);
  });

  it("create rejeita professionalProfileId de outro usuário", async () => {
    await expect(
      service.create("user-1", {
        name: "X",
        categoryId: "cat-1",
        professionalProfileId: "outro-usuario",
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("create rejeita se o perfil profissional não existir", async () => {
    prisma.professionalProfile.findUnique.mockResolvedValue(null);
    await expect(
      service.create("user-1", {
        name: "X",
        categoryId: "cat-1",
        professionalProfileId: "user-1",
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create rejeita companyId de empresa da qual não é membro", async () => {
    prisma.companyMember.findUnique.mockResolvedValue(null);
    await expect(
      service.create("user-1", {
        name: "X",
        categoryId: "cat-1",
        companyId: "comp-1",
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("create com professionalProfileId válido do próprio usuário funciona", async () => {
    prisma.professionalProfile.findUnique.mockResolvedValue({ userId: "user-1" });
    prisma.service.create.mockResolvedValue(baseService);

    const result = await service.create("user-1", {
      name: "Diagnóstico",
      categoryId: "cat-1",
      professionalProfileId: "user-1",
    });

    expect(result.professionalProfileId).toBe("user-1");
    expect(result.companyId).toBeNull();
  });

  it("update/remove rejeitam quem não é dono do serviço", async () => {
    prisma.service.findUnique.mockResolvedValue(baseService);
    await expect(
      service.update("outro-usuario", "svc-1", { name: "Hack" }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.remove("outro-usuario", "svc-1"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("update permite o próprio dono editar", async () => {
    prisma.service.findUnique.mockResolvedValue(baseService);
    prisma.service.update.mockResolvedValue({ ...baseService, name: "Novo nome" });

    const result = await service.update("user-1", "svc-1", { name: "Novo nome" });
    expect(result.name).toBe("Novo nome");
  });

  it("remove lança NotFoundException para serviço inexistente", async () => {
    prisma.service.findUnique.mockResolvedValue(null);
    await expect(service.remove("user-1", "nao-existe")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

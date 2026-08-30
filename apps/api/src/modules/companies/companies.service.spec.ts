import { Test } from "@nestjs/testing";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("CompaniesService", () => {
  let service: CompaniesService;
  let prisma: {
    company: { findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    companyMember: { findUnique: jest.Mock };
    $transaction: jest.Mock;
    $executeRaw: jest.Mock;
  };

  const companyRow = {
    id: "comp-1",
    tradeName: "Auto Center",
    legalName: "Auto Center Lda",
    taxId: null,
    categoryId: null,
    phone: null,
    whatsapp: null,
    province: "Benguela",
    city: "Benguela",
    verificationStatus: "PENDING" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      company: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      companyMember: { findUnique: jest.fn() },
      $transaction: jest.fn(),
      $executeRaw: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [CompaniesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(CompaniesService);
  });

  it("findById lança NotFoundException para empresa inexistente", async () => {
    prisma.company.findUnique.mockResolvedValue(null);
    await expect(service.findById("nao-existe")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("create nasce sempre como PENDING (nunca VERIFIED)", async () => {
    prisma.$transaction.mockImplementation(async (fn) =>
      fn({
        company: { create: jest.fn().mockResolvedValue(companyRow) },
        $executeRaw: jest.fn(),
        companyMember: { create: jest.fn() },
      }),
    );
    prisma.company.findUnique.mockResolvedValue(companyRow);

    const result = await service.create("user-1", {
      tradeName: "Auto Center",
      legalName: "Auto Center Lda",
    });

    expect(result.verificationStatus).toBe("PENDING");
  });

  it("update rejeita usuário que não é membro (FORBIDDEN)", async () => {
    prisma.companyMember.findUnique.mockResolvedValue(null);
    await expect(
      service.update("intruso", "comp-1", { tradeName: "Novo nome" }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("update permite membro (owner) editar", async () => {
    prisma.companyMember.findUnique.mockResolvedValue({
      companyId: "comp-1",
      userId: "owner-1",
      role: "owner",
    });
    prisma.company.update.mockResolvedValue(companyRow);
    prisma.company.findUnique.mockResolvedValue(companyRow);

    const result = await service.update("owner-1", "comp-1", {
      tradeName: "Novo nome",
    });
    expect(result.id).toBe("comp-1");
  });

  it("updateVerification lança NotFoundException para empresa inexistente", async () => {
    prisma.company.findUnique.mockResolvedValue(null);
    await expect(
      service.updateVerification("nao-existe", "VERIFIED"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updateVerification atualiza o status quando a empresa existe", async () => {
    prisma.company.findUnique.mockResolvedValue(companyRow);
    prisma.company.update.mockResolvedValue({
      ...companyRow,
      verificationStatus: "VERIFIED",
    });

    const result = await service.updateVerification("comp-1", "VERIFIED");
    expect(result.verificationStatus).toBe("VERIFIED");
  });
});

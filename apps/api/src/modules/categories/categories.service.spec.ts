import { Test } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("CategoriesService", () => {
  let service: CategoriesService;
  let prisma: {
    category: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  const baseCategory = {
    id: "cat-1",
    name: "Mecânica",
    slug: "mecanica",
    description: null,
    icon: null,
    parentId: null,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      category: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [CategoriesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(CategoriesService);
  });

  it("findAllActive filtra apenas categorias ativas", async () => {
    prisma.category.findMany.mockResolvedValue([baseCategory]);
    await service.findAllActive();
    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { active: true } }),
    );
  });

  it("create rejeita slug duplicado", async () => {
    prisma.category.findUnique.mockResolvedValue(baseCategory);
    await expect(
      service.create({ name: "X", slug: "mecanica" }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("create rejeita parentId inexistente", async () => {
    prisma.category.findUnique
      .mockResolvedValueOnce(null) // slug check
      .mockResolvedValueOnce(null); // parent check
    await expect(
      service.create({ name: "X", slug: "x", parentId: "nao-existe" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create com dados válidos cria a categoria", async () => {
    prisma.category.findUnique.mockResolvedValue(null);
    prisma.category.create.mockResolvedValue(baseCategory);
    const result = await service.create({ name: "Mecânica", slug: "mecanica" });
    expect(result.slug).toBe("mecanica");
  });

  it("update rejeita categoria inexistente", async () => {
    prisma.category.findUnique.mockResolvedValue(null);
    await expect(
      service.update("nao-existe", { name: "Y" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("update rejeita uma categoria sendo pai dela mesma", async () => {
    prisma.category.findUnique.mockResolvedValue(baseCategory);
    await expect(
      service.update("cat-1", { parentId: "cat-1" }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

import { Test } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("UsersService", () => {
  let service: UsersService;
  let prisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
    userLocation: { delete: jest.Mock };
    $queryRaw: jest.Mock;
    $executeRaw: jest.Mock;
  };

  const baseUser = {
    id: "user-1",
    email: "ana@konecta.test",
    name: "Ana",
    region: "AO",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn(), update: jest.fn() },
      userLocation: { delete: jest.fn() },
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  describe("findPublicById", () => {
    it("retorna usuário sem passwordHash", async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...baseUser,
        passwordHash: "hash-nao-deve-vazar",
      });

      const result = await service.findPublicById("user-1");

      expect(result.email).toBe("ana@konecta.test");
      expect((result as unknown as Record<string, unknown>).passwordHash).toBeUndefined();
    });

    it("lança NotFoundException se usuário não existe", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findPublicById("inexistente")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("updateProfile", () => {
    it("atualiza apenas os campos informados", async () => {
      prisma.user.update.mockResolvedValue({ ...baseUser, name: "Ana Silva" });

      const result = await service.updateProfile("user-1", { name: "Ana Silva" });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { name: "Ana Silva" },
      });
      expect(result.name).toBe("Ana Silva");
    });
  });

  describe("getLocation", () => {
    it("retorna campos nulos quando não há localização configurada", async () => {
      prisma.$queryRaw.mockResolvedValue([]);
      const result = await service.getLocation("user-1");
      expect(result).toEqual({
        province: null,
        city: null,
        latitude: null,
        longitude: null,
        updatedAt: null,
      });
    });

    it("mapeia longitude/latitude corretamente (sem inverter)", async () => {
      prisma.$queryRaw.mockResolvedValue([
        {
          province: "Luanda",
          city: "Luanda",
          longitude: -13.2894,
          latitude: -8.839,
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ]);
      const result = await service.getLocation("user-1");
      expect(result.longitude).toBe(-13.2894);
      expect(result.latitude).toBe(-8.839);
    });
  });

  describe("upsertLocation", () => {
    it("rejeita criação inicial sem province/city", async () => {
      prisma.$queryRaw.mockResolvedValueOnce([]); // existing check: vazio

      await expect(
        service.upsertLocation("user-1", { latitude: -8.8, longitude: -13.2 }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("permite criação inicial com province+city, mesmo sem coordenadas", async () => {
      prisma.$queryRaw
        .mockResolvedValueOnce([]) // existing check
        .mockResolvedValueOnce([
          {
            province: "Luanda",
            city: "Luanda",
            longitude: null,
            latitude: null,
            updatedAt: new Date(),
          },
        ]); // getLocation após insert

      const result = await service.upsertLocation("user-1", {
        province: "Luanda",
        city: "Luanda",
      });

      expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
      expect(result.province).toBe("Luanda");
    });
  });

  describe("deleteLocation", () => {
    it("não lança erro se a localização não existir (idempotente)", async () => {
      prisma.userLocation.delete.mockRejectedValue({ code: "P2025" });
      await expect(service.deleteLocation("user-1")).resolves.toBeUndefined();
    });

    it("propaga outros erros inesperados", async () => {
      prisma.userLocation.delete.mockRejectedValue({ code: "P9999" });
      await expect(service.deleteLocation("user-1")).rejects.toBeDefined();
    });
  });
});

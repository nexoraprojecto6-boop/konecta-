import { Test } from "@nestjs/testing";
import { DiscoveryService } from "./discovery.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("DiscoveryService", () => {
  let service: DiscoveryService;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [DiscoveryService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(DiscoveryService);
  });

  it("mapeia linhas para o formato tipado, convertendo distance_m para distanceKm", async () => {
    prisma.$queryRaw
      .mockResolvedValueOnce([
        {
          type: "professional",
          id: "user-1",
          name: "João",
          profession: "Mecânico",
          category_name: null,
          city: "Benguela",
          distance_m: 823.456,
          phone: null,
          whatsapp: null,
        },
      ])
      .mockResolvedValueOnce([{ total: 1 }]);

    const result = await service.search({
      lat: -12.577,
      lng: 13.404,
      radiusKm: 10,
      page: 1,
      limit: 20,
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].type).toBe("professional");
    expect(result.items[0].distanceKm).toBeCloseTo(0.82, 2);
    expect(result.pagination).toEqual({ page: 1, limit: 20, total: 1 });
  });

  it("nunca inclui geoLocation/latitude/longitude no item retornado", async () => {
    prisma.$queryRaw
      .mockResolvedValueOnce([
        {
          type: "company",
          id: "comp-1",
          name: "Auto Center",
          profession: null,
          category_name: "Mecânica",
          city: "Benguela",
          distance_m: 500,
          phone: "+244900000000",
          whatsapp: null,
        },
      ])
      .mockResolvedValueOnce([{ total: 1 }]);

    const result = await service.search({
      lat: -12.577,
      lng: 13.404,
      radiusKm: 10,
      page: 1,
      limit: 20,
    });

    const item = result.items[0] as unknown as Record<string, unknown>;
    expect(item.geoLocation).toBeUndefined();
    expect(item.latitude).toBeUndefined();
    expect(item.longitude).toBeUndefined();
  });

  it("retorna lista vazia e total zero quando não há resultados", async () => {
    prisma.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);

    const result = await service.search({
      lat: 0,
      lng: 0,
      radiusKm: 10,
      page: 1,
      limit: 20,
    });

    expect(result.items).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });
});

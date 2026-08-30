import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { DiscoverySearchInput } from "@konecta/validation";
import type {
  DiscoveryResultItem,
  DiscoverySearchResponse,
} from "@konecta/types";
import { PrismaService } from "../../prisma/prisma.service";

interface DiscoveryRow {
  type: "professional" | "company";
  id: string;
  name: string;
  profession: string | null;
  category_name: string | null;
  city: string | null;
  distance_m: number;
  phone: string | null;
  whatsapp: string | null;
}

/**
 * Serviço central de descoberta local. A busca é executada inteiramente
 * no PostgreSQL/PostGIS (ST_DWithin + ST_Distance com cast ::geography
 * para distância real em metros, não graus planos) — nunca carrega
 * todos os profissionais/empresas para a memória da aplicação.
 *
 * IMPORTANTE (privacidade): a resposta nunca inclui geoLocation,
 * latitude ou longitude — apenas city e distanceKm calculados no banco.
 *
 * A pesquisa textual (q) usa ILIKE nesta fase — arquitetura pensada
 * para permitir trocar por full-text search/embeddings futuramente
 * sem reescrever o restante do Discovery (a interface search() não muda).
 */
@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  async search(params: DiscoverySearchInput): Promise<DiscoverySearchResponse> {
    const { q, lat, lng, radiusKm, categoryId, page, limit } = params;
    const radiusMeters = radiusKm * 1000;
    const offset = (page - 1) * limit;
    const qPattern = q ? `%${q}%` : null;

    const categoryFilterProfessional = categoryId
      ? Prisma.sql`AND EXISTS (
          SELECT 1 FROM services s
          WHERE s."professionalProfileId" = pp."userId"
            AND s."categoryId" = ${categoryId} AND s.active = true
        )`
      : Prisma.empty;

    const categoryFilterCompany = categoryId
      ? Prisma.sql`AND (
          c."categoryId" = ${categoryId}
          OR EXISTS (
            SELECT 1 FROM services s
            WHERE s."companyId" = c.id
              AND s."categoryId" = ${categoryId} AND s.active = true
          )
        )`
      : Prisma.empty;

    const textFilterProfessional = qPattern
      ? Prisma.sql`AND (
          pp.profession ILIKE ${qPattern}
          OR EXISTS (
            SELECT 1 FROM services s
            LEFT JOIN categories cat ON cat.id = s."categoryId"
            WHERE s."professionalProfileId" = pp."userId" AND s.active = true
              AND (s.name ILIKE ${qPattern} OR cat.name ILIKE ${qPattern})
          )
        )`
      : Prisma.empty;

    const textFilterCompany = qPattern
      ? Prisma.sql`AND (
          c."tradeName" ILIKE ${qPattern}
          OR EXISTS (
            SELECT 1 FROM categories cat2
            WHERE cat2.id = c."categoryId" AND cat2.name ILIKE ${qPattern}
          )
          OR EXISTS (
            SELECT 1 FROM services s
            LEFT JOIN categories cat ON cat.id = s."categoryId"
            WHERE s."companyId" = c.id AND s.active = true
              AND (s.name ILIKE ${qPattern} OR cat.name ILIKE ${qPattern})
          )
        )`
      : Prisma.empty;

    const matchesCte = Prisma.sql`
      WITH matches AS (
        SELECT
          'professional' AS type,
          pp."userId" AS id,
          u.name AS name,
          pp.profession AS profession,
          NULL::text AS category_name,
          pp.city AS city,
          ST_Distance(
            pp."geoLocation"::geography,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
          ) AS distance_m,
          pp.phone AS phone,
          pp.whatsapp AS whatsapp
        FROM professional_profiles pp
        JOIN users u ON u.id = pp."userId"
        WHERE pp.active = true
          AND pp."geoLocation" IS NOT NULL
          AND ST_DWithin(
            pp."geoLocation"::geography,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
            ${radiusMeters}
          )
          ${categoryFilterProfessional}
          ${textFilterProfessional}

        UNION ALL

        SELECT
          'company' AS type,
          c.id AS id,
          c."tradeName" AS name,
          NULL::text AS profession,
          cat.name AS category_name,
          c.city AS city,
          ST_Distance(
            c."geoLocation"::geography,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
          ) AS distance_m,
          c.phone AS phone,
          c.whatsapp AS whatsapp
        FROM companies c
        LEFT JOIN categories cat ON cat.id = c."categoryId"
        WHERE c."verificationStatus" != 'REJECTED'
          AND c."geoLocation" IS NOT NULL
          AND ST_DWithin(
            c."geoLocation"::geography,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
            ${radiusMeters}
          )
          ${categoryFilterCompany}
          ${textFilterCompany}
      )
    `;

    const searchQuery = Prisma.sql`
      ${matchesCte}
      SELECT * FROM matches ORDER BY distance_m ASC LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = Prisma.sql`
      ${matchesCte}
      SELECT COUNT(*)::int AS total FROM matches
    `;

    const [rows, countResult] = await Promise.all([
      this.prisma.$queryRaw<DiscoveryRow[]>(searchQuery),
      this.prisma.$queryRaw<{ total: number }[]>(countQuery),
    ]);

    const items: DiscoveryResultItem[] = rows.map((row) => ({
      type: row.type,
      id: row.id,
      name: row.name,
      profession: row.profession ?? undefined,
      category: row.category_name ?? undefined,
      city: row.city,
      distanceKm: Math.round((Number(row.distance_m) / 1000) * 100) / 100,
      phone: row.phone,
      whatsapp: row.whatsapp,
    }));

    return {
      items,
      pagination: { page, limit, total: countResult[0]?.total ?? 0 },
    };
  }
}

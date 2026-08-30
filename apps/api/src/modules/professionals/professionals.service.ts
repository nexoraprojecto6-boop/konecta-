import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { ProfessionalProfile } from "@konecta/types";
import type {
  UpsertProfessionalProfileInput,
  UpdateProfessionalProfileInput,
} from "@konecta/validation";
import { PrismaService } from "../../prisma/prisma.service";

interface ProfessionalProfileRow {
  userId: string;
  name: string;
  profession: string;
  bio: string | null;
  radiusKm: number;
  phone: string | null;
  whatsapp: string | null;
  province: string | null;
  city: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Admin: lista profissionais ativos (visão administrativa simples). */
  async findAll(): Promise<ProfessionalProfile[]> {
    const rows = await this.prisma.$queryRaw<ProfessionalProfileRow[]>`
      SELECT pp."userId", u.name, pp.profession, pp.bio, pp."radiusKm",
             pp.phone, pp.whatsapp, pp.province, pp.city, pp.active,
             pp."createdAt", pp."updatedAt"
      FROM professional_profiles pp
      JOIN users u ON u.id = pp."userId"
      ORDER BY pp."createdAt" DESC
      LIMIT 50
    `;
    return rows.map((row) => this.toPublic(row));
  }

  async findByUserId(userId: string): Promise<ProfessionalProfile> {
    const rows = await this.prisma.$queryRaw<ProfessionalProfileRow[]>`
      SELECT pp."userId", u.name, pp.profession, pp.bio, pp."radiusKm",
             pp.phone, pp.whatsapp, pp.province, pp.city, pp.active,
             pp."createdAt", pp."updatedAt"
      FROM professional_profiles pp
      JOIN users u ON u.id = pp."userId"
      WHERE pp."userId" = ${userId}
    `;

    if (rows.length === 0) {
      throw new NotFoundException("Perfil profissional não encontrado");
    }

    return this.toPublic(rows[0]);
  }

  async create(
    userId: string,
    dto: UpsertProfessionalProfileInput,
  ): Promise<ProfessionalProfile> {
    const existing = await this.prisma.professionalProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException("Perfil profissional já existe para este usuário");
    }

    const hasCoordinates = dto.latitude !== undefined && dto.longitude !== undefined;

    if (hasCoordinates) {
      await this.prisma.$executeRaw`
        INSERT INTO professional_profiles
          ("userId", profession, bio, "radiusKm", phone, whatsapp, province, city, "geoLocation", "createdAt", "updatedAt")
        VALUES (
          ${userId}, ${dto.profession}, ${dto.bio ?? null}, ${dto.radiusKm ?? 10},
          ${dto.phone ?? null}, ${dto.whatsapp ?? null},
          ${dto.province ?? null}, ${dto.city ?? null},
          ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326),
          now(), now()
        )
      `;
    } else {
      await this.prisma.$executeRaw`
        INSERT INTO professional_profiles
          ("userId", profession, bio, "radiusKm", phone, whatsapp, province, city, "createdAt", "updatedAt")
        VALUES (
          ${userId}, ${dto.profession}, ${dto.bio ?? null}, ${dto.radiusKm ?? 10},
          ${dto.phone ?? null}, ${dto.whatsapp ?? null},
          ${dto.province ?? null}, ${dto.city ?? null}, now(), now()
        )
      `;
    }

    return this.findByUserId(userId);
  }

  async update(
    userId: string,
    dto: UpdateProfessionalProfileInput,
  ): Promise<ProfessionalProfile> {
    const existing = await this.prisma.professionalProfile.findUnique({
      where: { userId },
    });
    if (!existing) {
      throw new NotFoundException("Perfil profissional não encontrado");
    }

    const profession = dto.profession ?? existing.profession;
    const bio = dto.bio ?? existing.bio;
    const radiusKm = dto.radiusKm ?? existing.radiusKm;
    const phone = dto.phone ?? existing.phone;
    const whatsapp = dto.whatsapp ?? existing.whatsapp;
    const province = dto.province ?? existing.province;
    const city = dto.city ?? existing.city;
    const hasCoordinates = dto.latitude !== undefined && dto.longitude !== undefined;

    if (hasCoordinates) {
      await this.prisma.$executeRaw`
        UPDATE professional_profiles
        SET profession = ${profession}, bio = ${bio}, "radiusKm" = ${radiusKm},
            phone = ${phone}, whatsapp = ${whatsapp},
            province = ${province}, city = ${city},
            "geoLocation" = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326),
            "updatedAt" = now()
        WHERE "userId" = ${userId}
      `;
    } else {
      await this.prisma.$executeRaw`
        UPDATE professional_profiles
        SET profession = ${profession}, bio = ${bio}, "radiusKm" = ${radiusKm},
            phone = ${phone}, whatsapp = ${whatsapp},
            province = ${province}, city = ${city}, "updatedAt" = now()
        WHERE "userId" = ${userId}
      `;
    }

    return this.findByUserId(userId);
  }

  private toPublic(row: ProfessionalProfileRow): ProfessionalProfile {
    return {
      userId: row.userId,
      name: row.name,
      profession: row.profession,
      bio: row.bio,
      radiusKm: row.radiusKm,
      phone: row.phone,
      whatsapp: row.whatsapp,
      province: row.province,
      city: row.city,
      active: row.active,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}

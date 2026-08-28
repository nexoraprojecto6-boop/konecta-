import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { User, UserLocation } from "@konecta/types";
import type {
  UpdateProfileInput,
  UpdateLocationInput,
} from "@konecta/validation";
import { PrismaService } from "../../prisma/prisma.service";

interface UserRow {
  id: string;
  email: string;
  name: string;
  region: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LocationRow {
  province: string;
  city: string;
  longitude: number | null;
  latitude: number | null;
  updatedAt: Date;
}

const EMPTY_LOCATION: UserLocation = {
  province: null,
  city: null,
  latitude: null,
  longitude: null,
  updatedAt: null,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublicById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return this.toPublicUser(user);
  }

  async updateProfile(id: string, dto: UpdateProfileInput): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.region !== undefined ? { region: dto.region } : {}),
      },
    });

    return this.toPublicUser(user);
  }

  /**
   * Leitura via SQL cru: o campo geoLocation é Unsupported no Prisma
   * Client, então ST_X/ST_Y precisam ser usados explicitamente para
   * extrair longitude/latitude do ponto PostGIS.
   */
  async getLocation(userId: string): Promise<UserLocation> {
    const rows = await this.prisma.$queryRaw<LocationRow[]>`
      SELECT
        province,
        city,
        ST_X("geoLocation") AS longitude,
        ST_Y("geoLocation") AS latitude,
        "updatedAt"
      FROM user_locations
      WHERE "userId" = ${userId}
    `;

    if (rows.length === 0) {
      return EMPTY_LOCATION;
    }

    return this.toPublicLocation(rows[0]);
  }

  /**
   * Cria ou atualiza a localização do usuário. province/city são
   * obrigatórios apenas na primeira criação (a tabela exige NOT NULL);
   * em atualizações subsequentes, campos omitidos preservam o valor
   * já existente. Coordenadas, quando enviadas, sempre substituem o
   * ponto anterior por completo (sem histórico nesta fase).
   *
   * Atenção à ordem: PostGIS usa (longitude, latitude) — ST_MakePoint(X, Y).
   */
  async upsertLocation(
    userId: string,
    dto: UpdateLocationInput,
  ): Promise<UserLocation> {
    const existingRows = await this.prisma.$queryRaw<
      { province: string; city: string }[]
    >`SELECT province, city FROM user_locations WHERE "userId" = ${userId}`;

    const existing = existingRows[0];

    if (!existing && (dto.province === undefined || dto.city === undefined)) {
      throw new BadRequestException(
        "province e city são obrigatórios ao definir a localização pela primeira vez",
      );
    }

    const province = dto.province ?? existing?.province;
    const city = dto.city ?? existing?.city;
    const hasCoordinates =
      dto.latitude !== undefined && dto.longitude !== undefined;

    if (existing) {
      if (hasCoordinates) {
        await this.prisma.$executeRaw`
          UPDATE user_locations
          SET province = ${province},
              city = ${city},
              "geoLocation" = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326),
              "updatedAt" = now()
          WHERE "userId" = ${userId}
        `;
      } else {
        await this.prisma.$executeRaw`
          UPDATE user_locations
          SET province = ${province},
              city = ${city},
              "updatedAt" = now()
          WHERE "userId" = ${userId}
        `;
      }
    } else if (hasCoordinates) {
      await this.prisma.$executeRaw`
        INSERT INTO user_locations ("userId", province, city, "geoLocation", "updatedAt")
        VALUES (${userId}, ${province}, ${city}, ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326), now())
      `;
    } else {
      await this.prisma.$executeRaw`
        INSERT INTO user_locations ("userId", province, city, "updatedAt")
        VALUES (${userId}, ${province}, ${city}, now())
      `;
    }

    return this.getLocation(userId);
  }

  async deleteLocation(userId: string): Promise<void> {
    await this.prisma.userLocation.delete({ where: { userId } }).catch(
      (error: { code?: string }) => {
        // Idempotente: se não existir, não é um erro.
        if (error?.code === "P2025") {
          return;
        }
        throw error;
      },
    );
  }

  private toPublicUser(user: UserRow): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      region: user.region,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private toPublicLocation(row: LocationRow): UserLocation {
    return {
      province: row.province,
      city: row.city,
      latitude: row.latitude,
      longitude: row.longitude,
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}

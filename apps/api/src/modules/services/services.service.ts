import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Service } from "@konecta/types";
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from "@konecta/validation";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: {
    categoryId?: string;
    professionalProfileId?: string;
    companyId?: string;
  }): Promise<Service[]> {
    const rows = await this.prisma.service.findMany({
      where: {
        active: true,
        ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
        ...(filters.professionalProfileId
          ? { professionalProfileId: filters.professionalProfileId }
          : {}),
        ...(filters.companyId ? { companyId: filters.companyId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return rows.map((row) => this.toPublic(row));
  }

  /**
   * Cria um serviço, validando ownership (camada de aplicação) além da
   * CHECK constraint já existente no banco (services_owner_xor_check):
   * - professionalProfileId só pode ser o do próprio usuário autenticado
   *   (a chave primária de ProfessionalProfile É o userId);
   * - companyId só pode ser de uma empresa da qual o usuário é membro.
   */
  async create(userId: string, dto: CreateServiceInput): Promise<Service> {
    // O schema Zod já garante XOR na entrada; aqui validamos ownership.
    if (dto.professionalProfileId !== undefined) {
      if (dto.professionalProfileId !== userId) {
        throw new ForbiddenException(
          "Você só pode criar serviços para o seu próprio perfil profissional",
        );
      }
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId },
      });
      if (!profile) {
        throw new NotFoundException("Perfil profissional não encontrado");
      }
    }

    if (dto.companyId !== undefined) {
      const membership = await this.prisma.companyMember.findUnique({
        where: {
          companyId_userId: { companyId: dto.companyId, userId },
        },
      });
      if (!membership) {
        throw new ForbiddenException(
          "Você não tem permissão para criar serviços para esta empresa",
        );
      }
    }

    const created = await this.prisma.service.create({
      data: {
        name: dto.name,
        description: dto.description,
        categoryId: dto.categoryId,
        professionalProfileId: dto.professionalProfileId,
        companyId: dto.companyId,
      },
    });

    return this.toPublic(created);
  }

  async update(
    userId: string,
    serviceId: string,
    dto: UpdateServiceInput,
  ): Promise<Service> {
    const service = await this.assertOwnership(userId, serviceId);

    const updated = await this.prisma.service.update({
      where: { id: service.id },
      data: dto,
    });

    return this.toPublic(updated);
  }

  async remove(userId: string, serviceId: string): Promise<void> {
    const service = await this.assertOwnership(userId, serviceId);
    await this.prisma.service.delete({ where: { id: service.id } });
  }

  private async assertOwnership(userId: string, serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException("Serviço não encontrado");
    }

    if (service.professionalProfileId) {
      if (service.professionalProfileId !== userId) {
        throw new ForbiddenException(
          "Você não tem permissão para gerenciar este serviço",
        );
      }
      return service;
    }

    if (service.companyId) {
      const membership = await this.prisma.companyMember.findUnique({
        where: {
          companyId_userId: { companyId: service.companyId, userId },
        },
      });
      if (!membership) {
        throw new ForbiddenException(
          "Você não tem permissão para gerenciar este serviço",
        );
      }
      return service;
    }

    // Nunca deveria acontecer (CHECK constraint garante um dono),
    // mas mantido como salvaguarda defensiva.
    throw new BadRequestException("Serviço sem proprietário válido");
  }

  private toPublic(row: {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
    professionalProfileId: string | null;
    companyId: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Service {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      categoryId: row.categoryId,
      professionalProfileId: row.professionalProfileId,
      companyId: row.companyId,
      active: row.active,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}

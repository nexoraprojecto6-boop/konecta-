import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Company, CompanyVerificationStatus } from "@konecta/types";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@konecta/validation";
import { PrismaService } from "../../prisma/prisma.service";

interface CompanyRow {
  id: string;
  tradeName: string;
  legalName: string;
  taxId: string | null;
  categoryId: string | null;
  phone: string | null;
  whatsapp: string | null;
  province: string | null;
  city: string | null;
  verificationStatus: CompanyVerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Company[]> {
    const rows = await this.prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return rows.map((row) => this.toPublic(row));
  }

  async findById(id: string): Promise<Company> {
    const row = await this.prisma.company.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException("Empresa não encontrada");
    }
    return this.toPublic(row);
  }

  /**
   * Cria a empresa (sempre como PENDING — nunca verificada por padrão)
   * e o usuário autenticado torna-se seu primeiro CompanyMember (owner),
   * na mesma transação.
   */
  async create(userId: string, dto: CreateCompanyInput): Promise<Company> {
    const hasCoordinates = dto.latitude !== undefined && dto.longitude !== undefined;

    const company = await this.prisma.$transaction(async (tx) => {
      const created = await tx.company.create({
        data: {
          tradeName: dto.tradeName,
          legalName: dto.legalName,
          taxId: dto.taxId,
          categoryId: dto.categoryId,
          phone: dto.phone,
          whatsapp: dto.whatsapp,
          province: dto.province,
          city: dto.city,
          // verificationStatus usa o default do schema: PENDING
        },
      });

      if (hasCoordinates) {
        await tx.$executeRaw`
          UPDATE companies
          SET "geoLocation" = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)
          WHERE id = ${created.id}
        `;
      }

      await tx.companyMember.create({
        data: { companyId: created.id, userId, role: "owner" },
      });

      return created;
    });

    return this.findById(company.id);
  }

  async update(
    userId: string,
    companyId: string,
    dto: UpdateCompanyInput,
  ): Promise<Company> {
    await this.assertIsMember(companyId, userId);

    const hasCoordinates = dto.latitude !== undefined && dto.longitude !== undefined;

    await this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...(dto.tradeName !== undefined ? { tradeName: dto.tradeName } : {}),
        ...(dto.legalName !== undefined ? { legalName: dto.legalName } : {}),
        ...(dto.taxId !== undefined ? { taxId: dto.taxId } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.whatsapp !== undefined ? { whatsapp: dto.whatsapp } : {}),
        ...(dto.province !== undefined ? { province: dto.province } : {}),
        ...(dto.city !== undefined ? { city: dto.city } : {}),
      },
    });

    if (hasCoordinates) {
      await this.prisma.$executeRaw`
        UPDATE companies
        SET "geoLocation" = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)
        WHERE id = ${companyId}
      `;
    }

    return this.findById(companyId);
  }

  /**
   * Restrito a administradores da plataforma (verificado pelo AdminGuard
   * no controller) — nunca pelo próprio dono da empresa.
   */
  async updateVerification(
    companyId: string,
    status: CompanyVerificationStatus,
  ): Promise<Company> {
    const existing = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!existing) {
      throw new NotFoundException("Empresa não encontrada");
    }

    const updated = await this.prisma.company.update({
      where: { id: companyId },
      data: { verificationStatus: status },
    });

    return this.toPublic(updated);
  }

  private async assertIsMember(companyId: string, userId: string): Promise<void> {
    const membership = await this.prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException(
        "Você não tem permissão para gerenciar esta empresa",
      );
    }
  }

  private toPublic(row: CompanyRow): Company {
    return {
      id: row.id,
      tradeName: row.tradeName,
      legalName: row.legalName,
      taxId: row.taxId,
      categoryId: row.categoryId,
      phone: row.phone,
      whatsapp: row.whatsapp,
      province: row.province,
      city: row.city,
      verificationStatus: row.verificationStatus,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}

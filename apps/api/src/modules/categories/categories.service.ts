import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { Category } from "@konecta/types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@konecta/validation";
import { PrismaService } from "../../prisma/prisma.service";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Público: lista apenas categorias ativas. */
  async findAllActive(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    return rows.map((row) => this.toPublic(row));
  }

  /** Admin: lista todas, inclusive inativas. */
  async findAllForAdmin(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return rows.map((row) => this.toPublic(row));
  }

  async create(dto: CreateCategoryInput): Promise<Category> {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException("Já existe uma categoria com este slug");
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException("Categoria pai não encontrada");
      }
    }

    const created = await this.prisma.category.create({ data: dto });
    return this.toPublic(created);
  }

  async update(id: string, dto: UpdateCategoryInput): Promise<Category> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Categoria não encontrada");
    }

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new ConflictException("Uma categoria não pode ser pai dela mesma");
      }
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException("Categoria pai não encontrada");
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: dto,
    });
    return this.toPublic(updated);
  }

  private toPublic(row: CategoryRow): Category {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon: row.icon,
      parentId: row.parentId,
      active: row.active,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}

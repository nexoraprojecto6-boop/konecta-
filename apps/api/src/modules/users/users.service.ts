import { Injectable, NotFoundException } from "@nestjs/common";
import type { User } from "@konecta/types";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublicById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      region: user.region,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

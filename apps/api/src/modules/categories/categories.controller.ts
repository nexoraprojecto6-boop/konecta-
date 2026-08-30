import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { createCategorySchema, updateCategorySchema } from "@konecta/validation";
import type { Category } from "@konecta/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { CategoriesService } from "./categories.service";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Público: usado pelo Mobile para listar categorias disponíveis. */
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAllActive();
  }

  /** Admin: lista todas as categorias, inclusive inativas. */
  @Get("all")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAllForAdmin(): Promise<Category[]> {
    return this.categoriesService.findAllForAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, dto);
  }
}

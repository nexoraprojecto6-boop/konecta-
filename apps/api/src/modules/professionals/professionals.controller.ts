import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import type { Request } from "express";
import {
  upsertProfessionalProfileSchema,
  updateProfessionalProfileSchema,
} from "@konecta/validation";
import type { ProfessionalProfile, User } from "@konecta/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

import { ProfessionalsService } from "./professionals.service";
import type { UpsertProfessionalProfileDto } from "./dto/upsert-professional-profile.dto";
import type { UpdateProfessionalProfileDto } from "./dto/update-professional-profile.dto";

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller("professionals")
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  /** Admin: lista todos os profissionais (visão administrativa). */
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAll(): Promise<ProfessionalProfile[]> {
    return this.professionalsService.findAll();
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest): Promise<ProfessionalProfile> {
    return this.professionalsService.findByUserId(req.user.id);
  }

  @Post("me")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(upsertProfessionalProfileSchema))
  async createMe(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpsertProfessionalProfileDto,
  ): Promise<ProfessionalProfile> {
    return this.professionalsService.create(req.user.id, dto);
  }

  @Patch("me")
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateProfessionalProfileSchema))
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfessionalProfileDto,
  ): Promise<ProfessionalProfile> {
    return this.professionalsService.update(req.user.id, dto);
  }

  /**
   * Público (sem guard): usado pelo Mobile para exibir o perfil de um
   * profissional a partir de um resultado do Discovery. Colocado por
   * último para não conflitar com as rotas literais "/" e "/me" acima.
   */
  @Get(":userId")
  async findByUserId(
    @Param("userId") userId: string,
  ): Promise<ProfessionalProfile> {
    return this.professionalsService.findByUserId(userId);
  }
}

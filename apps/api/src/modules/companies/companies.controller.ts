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
  createCompanySchema,
  updateCompanySchema,
  updateCompanyVerificationSchema,
} from "@konecta/validation";
import type { Company, User } from "@konecta/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

import { CompaniesService } from "./companies.service";
import type { CreateCompanyDto } from "./dto/create-company.dto";
import type { UpdateCompanyDto } from "./dto/update-company.dto";
import type { UpdateCompanyVerificationDto } from "./dto/update-company-verification.dto";

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Company> {
    return this.companiesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createCompanySchema))
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.create(req.user.id, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateCompanySchema))
  async update(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.update(req.user.id, id, dto);
  }

  /**
   * Restrito a administradores da plataforma — nunca ao dono da empresa,
   * mesmo que ele seja o único CompanyMember. AdminGuard garante isso.
   */
  @Patch(":id/verification")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ZodValidationPipe(updateCompanyVerificationSchema))
  async updateVerification(
    @Param("id") id: string,
    @Body() dto: UpdateCompanyVerificationDto,
  ): Promise<Company> {
    return this.companiesService.updateVerification(
      id,
      dto.verificationStatus,
    );
  }
}

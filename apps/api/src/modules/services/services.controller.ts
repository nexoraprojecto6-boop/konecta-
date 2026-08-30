import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import type { Request } from "express";
import { createServiceSchema, updateServiceSchema } from "@konecta/validation";
import type { Service, User } from "@konecta/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

import { ServicesService } from "./services.service";
import type { CreateServiceDto } from "./dto/create-service.dto";
import type { UpdateServiceDto } from "./dto/update-service.dto";

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll(
    @Query("categoryId") categoryId?: string,
    @Query("professionalProfileId") professionalProfileId?: string,
    @Query("companyId") companyId?: string,
  ): Promise<Service[]> {
    return this.servicesService.findAll({
      categoryId,
      professionalProfileId,
      companyId,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createServiceSchema))
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateServiceDto,
  ): Promise<Service> {
    return this.servicesService.create(req.user.id, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateServiceSchema))
  async update(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(req.user.id, id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
  ): Promise<void> {
    await this.servicesService.remove(req.user.id, id);
  }
}

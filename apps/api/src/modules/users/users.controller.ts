import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import type { Request } from "express";
import { updateProfileSchema, updateLocationSchema } from "@konecta/validation";
import type { User, UserLocation } from "@konecta/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { UsersService } from "./users.service";
import type { UpdateProfileDto } from "./dto/update-profile.dto";
import type { UpdateLocationDto } from "./dto/update-location.dto";

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async me(@Req() req: AuthenticatedRequest): Promise<User> {
    // req.user já vem populado pelo JwtStrategy.validate(), mas
    // buscamos de novo no banco para garantir dados sempre atuais.
    return this.usersService.findPublicById(req.user.id);
  }

  @Patch("me")
  @UsePipes(new ZodValidationPipe(updateProfileSchema))
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get("me/location")
  async getMyLocation(
    @Req() req: AuthenticatedRequest,
  ): Promise<UserLocation> {
    return this.usersService.getLocation(req.user.id);
  }

  @Patch("me/location")
  @UsePipes(new ZodValidationPipe(updateLocationSchema))
  async updateMyLocation(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateLocationDto,
  ): Promise<UserLocation> {
    return this.usersService.upsertLocation(req.user.id, dto);
  }

  @Delete("me/location")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyLocation(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.usersService.deleteLocation(req.user.id);
  }
}

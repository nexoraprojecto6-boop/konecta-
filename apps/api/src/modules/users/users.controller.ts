import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { User } from "@konecta/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UsersService } from "./users.service";

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: AuthenticatedRequest): Promise<User> {
    // req.user já vem populado pelo JwtStrategy.validate(), mas
    // buscamos de novo no banco para garantir dados sempre atuais.
    return this.usersService.findPublicById(req.user.id);
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import type { User } from "@konecta/types";

interface AuthenticatedRequest extends Request {
  user: User;
}

/**
 * Guard mínimo que exige que o usuário autenticado tenha isAdmin=true.
 * Deve ser usado SEMPRE em conjunto com JwtAuthGuard (nesta ordem),
 * já que depende de req.user já estar populado.
 *
 * Não é um sistema de roles/permissões — apenas verifica a flag
 * booleana adicionada em User na Fase 4.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user?.isAdmin) {
      throw new ForbiddenException("Acesso restrito a administradores");
    }

    return true;
  }
}

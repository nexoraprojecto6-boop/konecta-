import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard que protege endpoints exigindo um access token JWT válido
 * no header Authorization: Bearer <token>.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

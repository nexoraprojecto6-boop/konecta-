/**
 * Payload do access token JWT. Contém apenas o identificador do usuário —
 * nenhum dado sensível (nunca passwordHash, nunca email por padrão)
 * é embutido no token.
 */
export interface JwtPayload {
  sub: string; // id do usuário
}

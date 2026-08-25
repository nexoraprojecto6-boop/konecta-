import type { RegisterInput } from "@konecta/validation";

/**
 * O formato do corpo da requisição é o mesmo schema Zod compartilhado
 * (@konecta/validation). Este tipo existe apenas para tipagem no
 * controller/service; a validação de fato acontece no ZodValidationPipe.
 */
export type RegisterDto = RegisterInput;

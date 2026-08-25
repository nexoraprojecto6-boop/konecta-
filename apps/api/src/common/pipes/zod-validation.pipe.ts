import { BadRequestException, PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";

/**
 * Pipe genérico que valida o corpo da requisição contra um schema Zod.
 * Reaproveita os schemas definidos em @konecta/validation, evitando
 * duplicar regras de validação entre API, Admin e Mobile.
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: "Dados de entrada inválidos",
        errors: result.error.flatten().fieldErrors,
      });
    }

    return result.data;
  }
}

import { baseEnvSchema } from "@konecta/validation";

/**
 * Valida as variáveis de ambiente da API na inicialização.
 * Se algo estiver faltando ou incorreto, a aplicação falha rápido
 * (fail fast) em vez de subir em um estado inconsistente.
 */
export function validate(config: Record<string, unknown>) {
  const result = baseEnvSchema.safeParse(config);

  if (!result.success) {
    const formatted = result.error.format();
    throw new Error(
      `Variáveis de ambiente inválidas: ${JSON.stringify(formatted, null, 2)}`,
    );
  }

  return result.data;
}

import { z } from "zod";

/**
 * Schemas de validação compartilhados.
 * Fase 1: apenas o schema base de variáveis de ambiente da API,
 * reaproveitável caso outros serviços precisem validar as mesmas envs.
 */

export const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatório"),
  REDIS_URL: z.string().min(1, "REDIS_URL é obrigatório"),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;

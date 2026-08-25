import { z } from "zod";
import { APP_REGIONS } from "@konecta/config";

/**
 * Schemas de validação compartilhados.
 * Fase 1: schema base de variáveis de ambiente da API.
 * Fase 2: schemas de autenticação (cadastro, login, refresh, logout),
 * reaproveitáveis pela API (validação de entrada) e potencialmente
 * pelos formulários do Admin/Mobile.
 */

export const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatório"),
  REDIS_URL: z.string().min(1, "REDIS_URL é obrigatório"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter pelo menos 32 caracteres"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;

/**
 * Senha: mínimo 8 caracteres, ao menos 1 letra e 1 número.
 * Nenhuma outra regra de composição foi solicitada para a Fase 2.
 */
export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Za-z]/, "A senha deve conter ao menos uma letra")
  .regex(/[0-9]/, "A senha deve conter ao menos um número");

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: passwordSchema,
  name: z.string().min(1, "Nome é obrigatório"),
  region: z.enum(APP_REGIONS),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken é obrigatório"),
});
export type RefreshInput = z.infer<typeof refreshSchema>;

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken é obrigatório"),
});
export type LogoutInput = z.infer<typeof logoutSchema>;

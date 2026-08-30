import { z } from "zod";
import {
  APP_REGIONS,
  COMPANY_VERIFICATION_STATUSES,
  MAX_DISCOVERY_RADIUS_KM,
  DEFAULT_DISCOVERY_RADIUS_KM,
} from "@konecta/config";

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

/**
 * Fase 3 — perfil e localização básica.
 */

export const updateProfileSchema = z
  .object({
    name: z.string().min(1, "Nome não pode ser vazio").optional(),
    region: z.enum(APP_REGIONS).optional(),
  })
  .refine((data) => data.name !== undefined || data.region !== undefined, {
    message: "Informe ao menos um campo para atualizar",
  });
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateLocationSchema = z
  .object({
    province: z.string().min(1, "Província não pode ser vazia").optional(),
    city: z.string().min(1, "Cidade não pode ser vazia").optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .refine(
    (data) => (data.latitude === undefined) === (data.longitude === undefined),
    { message: "latitude e longitude devem ser enviadas juntas" },
  )
  .refine(
    (data) =>
      data.province !== undefined ||
      data.city !== undefined ||
      data.latitude !== undefined,
    { message: "Informe ao menos um campo para atualizar" },
  );
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;

/**
 * Fase 4 — KONECTA Discovery (categorias, profissionais, empresas,
 * serviços, busca por proximidade).
 */

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífen"),
  description: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().uuid().optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    parentId: z.string().uuid().nullable().optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const upsertProfessionalProfileSchema = z.object({
  profession: z.string().min(1, "Profissão é obrigatória"),
  bio: z.string().max(500).optional(),
  radiusKm: z.number().int().min(1).max(100).optional(),
  phone: z.string().min(1).optional(),
  whatsapp: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
}).refine(
  (data) => (data.latitude === undefined) === (data.longitude === undefined),
  { message: "latitude e longitude devem ser enviadas juntas" },
);
export type UpsertProfessionalProfileInput = z.infer<
  typeof upsertProfessionalProfileSchema
>;

export const updateProfessionalProfileSchema = z
  .object({
    profession: z.string().min(1).optional(),
    bio: z.string().max(500).optional(),
    radiusKm: z.number().int().min(1).max(100).optional(),
    phone: z.string().min(1).optional(),
    whatsapp: z.string().min(1).optional(),
    province: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .refine(
    (data) => (data.latitude === undefined) === (data.longitude === undefined),
    { message: "latitude e longitude devem ser enviadas juntas" },
  )
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });
export type UpdateProfessionalProfileInput = z.infer<
  typeof updateProfessionalProfileSchema
>;

export const createCompanySchema = z.object({
  tradeName: z.string().min(1, "Nome comercial é obrigatório"),
  legalName: z.string().min(1, "Nome legal é obrigatório"),
  taxId: z.string().min(1).optional(),
  categoryId: z.string().uuid().optional(),
  phone: z.string().min(1).optional(),
  whatsapp: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
}).refine(
  (data) => (data.latitude === undefined) === (data.longitude === undefined),
  { message: "latitude e longitude devem ser enviadas juntas" },
);
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = z
  .object({
    tradeName: z.string().min(1).optional(),
    legalName: z.string().min(1).optional(),
    taxId: z.string().min(1).optional(),
    categoryId: z.string().uuid().optional(),
    phone: z.string().min(1).optional(),
    whatsapp: z.string().min(1).optional(),
    province: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .refine(
    (data) => (data.latitude === undefined) === (data.longitude === undefined),
    { message: "latitude e longitude devem ser enviadas juntas" },
  )
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

export const updateCompanyVerificationSchema = z.object({
  verificationStatus: z.enum(COMPANY_VERIFICATION_STATUSES),
});
export type UpdateCompanyVerificationInput = z.infer<
  typeof updateCompanyVerificationSchema
>;

export const createServiceSchema = z
  .object({
    name: z.string().min(1, "Nome do serviço é obrigatório"),
    description: z.string().max(500).optional(),
    categoryId: z.string().uuid("categoryId inválido"),
    professionalProfileId: z.string().uuid().optional(),
    companyId: z.string().uuid().optional(),
  })
  .refine(
    (data) =>
      (data.professionalProfileId !== undefined) !==
      (data.companyId !== undefined),
    {
      message:
        "Informe exatamente um proprietário: professionalProfileId OU companyId",
    },
  );
export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().max(500).optional(),
    categoryId: z.string().uuid().optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

export const discoverySearchSchema = z.object({
  q: z.string().trim().min(1).optional(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce
    .number()
    .min(1)
    .max(MAX_DISCOVERY_RADIUS_KM)
    .default(DEFAULT_DISCOVERY_RADIUS_KM),
  categoryId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type DiscoverySearchInput = z.infer<typeof discoverySearchSchema>;

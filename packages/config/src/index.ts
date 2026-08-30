/**
 * Configurações e constantes compartilhadas entre as aplicações.
 * Fase 1: metadados básicos do projeto.
 * Fase 3: lista de províncias por país, usada na validação de
 * localização (API) e no seletor de província (Mobile).
 */

export const APP_NAME = "KONECTA";

export const APP_REGIONS = ["AO", "MZ"] as const;
export type AppRegion = (typeof APP_REGIONS)[number];

export const PROVINCES: Record<AppRegion, string[]> = {
  AO: [
    "Bengo",
    "Benguela",
    "Bié",
    "Cabinda",
    "Cuando Cubango",
    "Cuanza Norte",
    "Cuanza Sul",
    "Cunene",
    "Huambo",
    "Huíla",
    "Luanda",
    "Lunda Norte",
    "Lunda Sul",
    "Malanje",
    "Moxico",
    "Namibe",
    "Uíge",
    "Zaire",
  ],
  MZ: [
    "Cabo Delgado",
    "Gaza",
    "Inhambane",
    "Manica",
    "Maputo",
    "Maputo Cidade",
    "Nampula",
    "Niassa",
    "Sofala",
    "Tete",
    "Zambézia",
  ],
};

/**
 * Fase 4 — KONECTA Discovery.
 */

export const COMPANY_VERIFICATION_STATUSES = [
  "PENDING",
  "VERIFIED",
  "REJECTED",
] as const;
export type CompanyVerificationStatus =
  (typeof COMPANY_VERIFICATION_STATUSES)[number];

/** Raio padrão de atuação de um profissional, em km. */
export const DEFAULT_PROFESSIONAL_RADIUS_KM = 10;

/** Raio máximo de busca do Discovery, em km — evita queries custosas demais. */
export const MAX_DISCOVERY_RADIUS_KM = 50;

/** Raio padrão de busca do Discovery quando o cliente não especificar. */
export const DEFAULT_DISCOVERY_RADIUS_KM = 10;

/**
 * Configurações e constantes compartilhadas entre as aplicações.
 * Fase 1: apenas metadados básicos do projeto.
 */

export const APP_NAME = "KONECTA";

export const APP_REGIONS = ["AO", "MZ"] as const;
export type AppRegion = (typeof APP_REGIONS)[number];

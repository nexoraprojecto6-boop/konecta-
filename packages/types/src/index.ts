/**
 * Tipos compartilhados entre api, mobile e admin.
 * Fase 1: apenas tipos genéricos de infraestrutura.
 * Nenhum tipo de domínio de negócio ainda (usuário, serviço, etc.).
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface HealthStatus {
  status: "ok" | "error";
  timestamp: string;
  service: string;
}

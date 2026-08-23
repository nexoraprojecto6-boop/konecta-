import type { HealthStatus } from "@konecta/types";
import { env } from "../config/env";

/**
 * Cliente HTTP simples usando fetch nativo.
 * Fase 1: apenas health check. Sem autenticação ainda.
 */

export async function getApiHealth(): Promise<HealthStatus> {
  const response = await fetch(`${env.apiUrl}/health`);

  if (!response.ok) {
    throw new Error(`Falha ao consultar a API: ${response.status}`);
  }

  return response.json() as Promise<HealthStatus>;
}

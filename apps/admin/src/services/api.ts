import type {
  AuthResponse,
  LoginPayload,
  User,
  HealthStatus,
} from "@konecta/types";
import { env } from "../config/env";

/**
 * Cliente HTTP simples usando fetch nativo.
 * Fase 2: apenas login (sem cadastro de administrador, por decisão
 * explícita do escopo desta fase).
 */

async function parseJsonOrThrow(response: Response): Promise<unknown> {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (body as { message?: string })?.message ?? `Erro ${response.status}`;
    throw new Error(message);
  }

  return body;
}

export async function getApiHealth(): Promise<HealthStatus> {
  const response = await fetch(`${env.apiUrl}/health`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Falha ao consultar a API: ${response.status}`);
  }

  return response.json() as Promise<HealthStatus>;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${env.apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return parseJsonOrThrow(response) as Promise<AuthResponse>;
}

export async function logout(refreshToken: string): Promise<void> {
  await fetch(`${env.apiUrl}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
}

export async function getMe(accessToken: string): Promise<User> {
  const response = await fetch(`${env.apiUrl}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return parseJsonOrThrow(response) as Promise<User>;
}

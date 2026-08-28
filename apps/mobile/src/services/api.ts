import type {
  HealthStatus,
  AuthResponse,
  AuthTokens,
  RegisterPayload,
  LoginPayload,
  User,
  UserLocation,
  UpdateProfilePayload,
  UpdateLocationPayload,
} from "@konecta/types";
import { env } from "../config/env";

/**
 * Cliente HTTP simples usando fetch nativo.
 * Fase 1: apenas health check.
 * Fase 2: endpoints de autenticação e usuário.
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
  const response = await fetch(`${env.apiUrl}/health`);

  if (!response.ok) {
    throw new Error(`Falha ao consultar a API: ${response.status}`);
  }

  return response.json() as Promise<HealthStatus>;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${env.apiUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response) as Promise<AuthResponse>;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${env.apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response) as Promise<AuthResponse>;
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const response = await fetch(`${env.apiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return parseJsonOrThrow(response) as Promise<AuthTokens>;
}

export async function logout(refreshToken: string): Promise<void> {
  await fetch(`${env.apiUrl}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  // Logout é tratado como best-effort no cliente: mesmo que a chamada
  // falhe (ex: sem rede), a sessão local é limpa de qualquer forma.
}

export async function getMe(accessToken: string): Promise<User> {
  const response = await fetch(`${env.apiUrl}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return parseJsonOrThrow(response) as Promise<User>;
}

export async function updateProfile(
  accessToken: string,
  payload: UpdateProfilePayload,
): Promise<User> {
  const response = await fetch(`${env.apiUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response) as Promise<User>;
}

export async function getMyLocation(accessToken: string): Promise<UserLocation> {
  const response = await fetch(`${env.apiUrl}/users/me/location`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return parseJsonOrThrow(response) as Promise<UserLocation>;
}

export async function updateMyLocation(
  accessToken: string,
  payload: UpdateLocationPayload,
): Promise<UserLocation> {
  const response = await fetch(`${env.apiUrl}/users/me/location`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response) as Promise<UserLocation>;
}

export async function deleteMyLocation(accessToken: string): Promise<void> {
  const response = await fetch(`${env.apiUrl}/users/me/location`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Falha ao remover localização: ${response.status}`);
  }
}

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
  Category,
  ProfessionalProfile,
  UpsertProfessionalProfilePayload,
  Company,
  Service,
  DiscoverySearchParams,
  DiscoverySearchResponse,
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

/**
 * Fase 4 — KONECTA Discovery.
 */

export async function listCategories(): Promise<Category[]> {
  const response = await fetch(`${env.apiUrl}/categories`);
  return parseJsonOrThrow(response) as Promise<Category[]>;
}

export async function searchDiscovery(
  params: DiscoverySearchParams,
): Promise<DiscoverySearchResponse> {
  const query = new URLSearchParams();
  query.set("lat", String(params.lat));
  query.set("lng", String(params.lng));
  if (params.q) query.set("q", params.q);
  if (params.radiusKm) query.set("radiusKm", String(params.radiusKm));
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${env.apiUrl}/discovery/search?${query.toString()}`);
  return parseJsonOrThrow(response) as Promise<DiscoverySearchResponse>;
}

export async function getProfessionalProfile(
  userId: string,
): Promise<ProfessionalProfile> {
  const response = await fetch(`${env.apiUrl}/professionals/${userId}`);
  return parseJsonOrThrow(response) as Promise<ProfessionalProfile>;
}

export async function getCompanyProfile(id: string): Promise<Company> {
  const response = await fetch(`${env.apiUrl}/companies/${id}`);
  return parseJsonOrThrow(response) as Promise<Company>;
}

export async function listServicesByOwner(params: {
  professionalProfileId?: string;
  companyId?: string;
}): Promise<Service[]> {
  const query = new URLSearchParams();
  if (params.professionalProfileId) {
    query.set("professionalProfileId", params.professionalProfileId);
  }
  if (params.companyId) query.set("companyId", params.companyId);

  const response = await fetch(`${env.apiUrl}/services?${query.toString()}`);
  return parseJsonOrThrow(response) as Promise<Service[]>;
}

export async function getMyProfessionalProfile(
  accessToken: string,
): Promise<ProfessionalProfile | null> {
  const response = await fetch(`${env.apiUrl}/professionals/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 404) {
    return null;
  }
  return parseJsonOrThrow(response) as Promise<ProfessionalProfile>;
}

export async function activateProfessionalProfile(
  accessToken: string,
  payload: UpsertProfessionalProfilePayload,
): Promise<ProfessionalProfile> {
  const response = await fetch(`${env.apiUrl}/professionals/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response) as Promise<ProfessionalProfile>;
}

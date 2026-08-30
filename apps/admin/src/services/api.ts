import type {
  AuthResponse,
  LoginPayload,
  User,
  HealthStatus,
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  ProfessionalProfile,
  Company,
  CompanyVerificationStatus,
  Service,
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

/**
 * Fase 4 — KONECTA Discovery (administração mínima).
 */

function authHeaders(accessToken: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function listCategoriesAdmin(
  accessToken: string,
): Promise<Category[]> {
  const response = await fetch(`${env.apiUrl}/categories/all`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  });
  return parseJsonOrThrow(response) as Promise<Category[]>;
}

export async function createCategory(
  accessToken: string,
  payload: CreateCategoryPayload,
): Promise<Category> {
  const response = await fetch(`${env.apiUrl}/categories`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response) as Promise<Category>;
}

export async function updateCategory(
  accessToken: string,
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  const response = await fetch(`${env.apiUrl}/categories/${id}`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response) as Promise<Category>;
}

export async function listProfessionalsAdmin(
  accessToken: string,
): Promise<ProfessionalProfile[]> {
  const response = await fetch(`${env.apiUrl}/professionals`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  });
  return parseJsonOrThrow(response) as Promise<ProfessionalProfile[]>;
}

export async function listCompanies(accessToken: string): Promise<Company[]> {
  const response = await fetch(`${env.apiUrl}/companies`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  });
  return parseJsonOrThrow(response) as Promise<Company[]>;
}

export async function updateCompanyVerification(
  accessToken: string,
  id: string,
  verificationStatus: CompanyVerificationStatus,
): Promise<Company> {
  const response = await fetch(`${env.apiUrl}/companies/${id}/verification`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ verificationStatus }),
  });
  return parseJsonOrThrow(response) as Promise<Company>;
}

export async function listServices(accessToken: string): Promise<Service[]> {
  const response = await fetch(`${env.apiUrl}/services`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  });
  return parseJsonOrThrow(response) as Promise<Service[]>;
}

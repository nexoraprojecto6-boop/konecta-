/**
 * Tipos compartilhados entre api, mobile e admin.
 * Fase 1: tipos genéricos de infraestrutura.
 * Fase 2: tipos de usuário e autenticação.
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

/**
 * Representação pública do usuário. NUNCA inclui passwordHash
 * ou qualquer outro dado sensível.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  region: string;
  /**
   * Flag mínima de administrador da plataforma (Fase 4). Exposta aqui
   * porque o próprio usuário precisa saber seu status para o Admin
   * decidir se mostra telas administrativas — não é dado de terceiros.
   */
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  region: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Fase 3 — perfil e localização básica.
 */

export interface UserLocation {
  province: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  updatedAt: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  region?: string;
}

export interface UpdateLocationPayload {
  province?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Fase 4 — KONECTA Discovery.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  active?: boolean;
}

export interface ProfessionalProfile {
  userId: string;
  name: string;
  profession: string;
  bio: string | null;
  radiusKm: number;
  phone: string | null;
  whatsapp: string | null;
  province: string | null;
  city: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertProfessionalProfilePayload {
  profession: string;
  bio?: string;
  radiusKm?: number;
  phone?: string;
  whatsapp?: string;
  province?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export type CompanyVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface Company {
  id: string;
  tradeName: string;
  legalName: string;
  taxId: string | null;
  categoryId: string | null;
  phone: string | null;
  whatsapp: string | null;
  province: string | null;
  city: string | null;
  verificationStatus: CompanyVerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyPayload {
  tradeName: string;
  legalName: string;
  taxId?: string;
  categoryId?: string;
  phone?: string;
  whatsapp?: string;
  province?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateCompanyPayload {
  tradeName?: string;
  legalName?: string;
  taxId?: string;
  categoryId?: string;
  phone?: string;
  whatsapp?: string;
  province?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  professionalProfileId: string | null;
  companyId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  categoryId: string;
  professionalProfileId?: string;
  companyId?: string;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  categoryId?: string;
  active?: boolean;
}

export interface DiscoverySearchParams {
  q?: string;
  lat: number;
  lng: number;
  radiusKm?: number;
  categoryId?: string;
  page?: number;
  limit?: number;
}

/** Resultado tipado do Discovery — nunca inclui coordenadas exatas. */
export interface DiscoveryResultItem {
  type: "professional" | "company";
  id: string;
  name: string;
  profession?: string;
  category?: string;
  city: string | null;
  distanceKm: number;
  phone?: string | null;
  whatsapp?: string | null;
}

export interface DiscoverySearchResponse {
  items: DiscoveryResultItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

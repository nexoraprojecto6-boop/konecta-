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

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User, LoginPayload } from "@konecta/types";
import * as api from "../services/api";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const REFRESH_TOKEN_KEY = "konecta_admin_refresh_token";

/**
 * Nota de segurança: o token de refresh é guardado em localStorage por
 * simplicidade nesta fase (Admin com apenas login). Isso expõe o token
 * a XSS caso exista uma vulnerabilidade de injeção de script no painel.
 * Uma evolução futura recomendada é mover essa persistência para um
 * cookie httpOnly, definido por uma rota de API do próprio Next.js.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fase 2: sem endpoint de refresh usado no Admin (login simples).
    // Se um token de acesso válido não estiver em memória, a sessão
    // simplesmente não é restaurada automaticamente ao recarregar a página.
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setError(null);
    try {
      const response = await api.login(payload);
      window.localStorage.setItem(
        REFRESH_TOKEN_KEY,
        response.tokens.refreshToken,
      );
      setAccessToken(response.tokens.accessToken);
      setUser(response.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao entrar");
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    const storedRefreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (storedRefreshToken) {
      await api.logout(storedRefreshToken).catch(() => undefined);
    }
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return ctx;
}

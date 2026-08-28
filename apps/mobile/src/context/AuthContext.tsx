import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User, RegisterPayload, LoginPayload } from "@konecta/types";
import * as api from "../services/api";
import {
  saveRefreshToken,
  getRefreshToken,
  clearRefreshToken,
} from "../services/authStorage";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ao abrir o app, tenta restaurar a sessão a partir do refresh token
  // salvo com segurança no dispositivo (nunca a senha).
  useEffect(() => {
    (async () => {
      try {
        const storedRefreshToken = await getRefreshToken();
        if (!storedRefreshToken) {
          return;
        }
        const tokens = await api.refresh(storedRefreshToken);
        await saveRefreshToken(tokens.refreshToken);
        setAccessToken(tokens.accessToken);
        const me = await api.getMe(tokens.accessToken);
        setUser(me);
      } catch {
        await clearRefreshToken();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleAuthResponse = useCallback(
    async (response: { user: User; tokens: { accessToken: string; refreshToken: string } }) => {
      await saveRefreshToken(response.tokens.refreshToken);
      setAccessToken(response.tokens.accessToken);
      setUser(response.user);
    },
    [],
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      setError(null);
      try {
        const response = await api.login(payload);
        await handleAuthResponse(response);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao entrar");
        throw e;
      }
    },
    [handleAuthResponse],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setError(null);
      try {
        const response = await api.register(payload);
        await handleAuthResponse(response);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao cadastrar");
        throw e;
      }
    },
    [handleAuthResponse],
  );

  const logout = useCallback(async () => {
    const storedRefreshToken = await getRefreshToken();
    if (storedRefreshToken) {
      await api.logout(storedRefreshToken).catch(() => undefined);
    }
    await clearRefreshToken();
    setAccessToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated: User) => {
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
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

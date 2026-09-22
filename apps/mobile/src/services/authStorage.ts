import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Persiste apenas o refresh token no armazenamento seguro do dispositivo
 * (Keychain no iOS, Keystore no Android). O access token, de curta
 * duração, fica só em memória (estado do AuthContext) e nunca é
 * persistido em disco. A senha nunca é armazenada em nenhum momento.
 *
 * Na web, expo-secure-store não tem implementação nativa (não existe
 * Keychain/Keystore no browser), por isso usamos localStorage como
 * fallback apenas nesta plataforma — só para fins de desenvolvimento
 * e teste. Em produção, o app roda como nativo (iOS/Android), onde o
 * SecureStore é sempre usado.
 */
const REFRESH_TOKEN_KEY = "konecta_refresh_token";

const isWeb = Platform.OS === "web";

export async function saveRefreshToken(token: string): Promise<void> {
  if (isWeb) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken(): Promise<string | null> {
  if (isWeb) {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function clearRefreshToken(): Promise<void> {
  if (isWeb) {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

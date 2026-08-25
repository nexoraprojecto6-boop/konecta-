import * as SecureStore from "expo-secure-store";

/**
 * Persiste apenas o refresh token no armazenamento seguro do dispositivo
 * (Keychain no iOS, Keystore no Android). O access token, de curta
 * duração, fica só em memória (estado do AuthContext) e nunca é
 * persistido em disco. A senha nunca é armazenada em nenhum momento.
 */
const REFRESH_TOKEN_KEY = "konecta_refresh_token";

export async function saveRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function clearRefreshToken(): Promise<void> {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

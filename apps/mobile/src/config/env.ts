/**
 * Leitura de variáveis de ambiente do app mobile.
 * Expo SDK 49+ expõe automaticamente variáveis prefixadas com EXPO_PUBLIC_.
 * Nenhuma dependência extra (ex: expo-constants) necessária nesta fase.
 */

export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",
};

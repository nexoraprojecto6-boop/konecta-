/**
 * Leitura de variáveis de ambiente do painel administrativo.
 * Variáveis prefixadas com NEXT_PUBLIC_ ficam disponíveis no client-side.
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
};

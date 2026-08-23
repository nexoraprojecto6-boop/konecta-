/**
 * Configuração de ESLint do app mobile — estende a configuração compartilhada do monorepo.
 * O parser @typescript-eslint/parser já reconhece JSX/TSX automaticamente pela extensão do arquivo.
 */
module.exports = {
  root: true,
  extends: ["@konecta/eslint-config"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  env: {
    node: true,
    es2021: true,
  },
};

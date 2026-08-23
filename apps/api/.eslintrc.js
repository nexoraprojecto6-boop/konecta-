/**
 * Configuração de ESLint da API — estende a configuração compartilhada do monorepo.
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

import React from "react";
import { getApiHealth } from "../services/api";

export default async function HomePage() {
  let status = "Indisponível";

  try {
    const health = await getApiHealth();
    status = health.status;
  } catch {
    status = "Indisponível";
  }

  return (
    <main>
      <h1>KONECTA — Admin</h1>
      <p>Fase 1 — Fundação</p>
      <p>Status da API: {status}</p>
    </main>
  );
}

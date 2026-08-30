"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@konecta/types";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

export default function ServicesPage() {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!accessToken || !user?.isAdmin) return;
    api
      .listServices(accessToken)
      .then(setServices)
      .catch(() => setError("Falha ao carregar serviços"))
      .finally(() => setLoadingList(false));
  }, [accessToken, user]);

  if (isLoading || !user?.isAdmin) {
    return <main style={{ padding: 24 }}>Carregando...</main>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 700 }}>
      <h1>Serviços</h1>
      {error && <p style={{ color: "#c0392b" }}>{error}</p>}
      {loadingList ? (
        <p>Carregando...</p>
      ) : services.length === 0 ? (
        <p>Nenhum serviço cadastrado ainda.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Nome</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Proprietário</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td style={{ padding: "6px 0" }}>{s.name}</td>
                <td>
                  {s.professionalProfileId ? "Profissional" : "Empresa"}
                </td>
                <td>{s.active ? "Ativo" : "Inativo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

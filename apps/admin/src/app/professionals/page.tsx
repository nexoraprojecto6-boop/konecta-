"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfessionalProfile } from "@konecta/types";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

export default function ProfessionalsPage() {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>([]);
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
      .listProfessionalsAdmin(accessToken)
      .then(setProfessionals)
      .catch(() => setError("Falha ao carregar profissionais"))
      .finally(() => setLoadingList(false));
  }, [accessToken, user]);

  if (isLoading || !user?.isAdmin) {
    return <main style={{ padding: 24 }}>Carregando...</main>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 700 }}>
      <h1>Profissionais</h1>
      {error && <p style={{ color: "#c0392b" }}>{error}</p>}
      {loadingList ? (
        <p>Carregando...</p>
      ) : professionals.length === 0 ? (
        <p>Nenhum profissional cadastrado ainda.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Nome</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Profissão</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Cidade</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Raio</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((p) => (
              <tr key={p.userId}>
                <td style={{ padding: "6px 0" }}>{p.name}</td>
                <td>{p.profession}</td>
                <td>{p.city ?? "—"}</td>
                <td>{p.radiusKm} km</td>
                <td>{p.active ? "Ativo" : "Inativo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

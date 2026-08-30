"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Company, CompanyVerificationStatus } from "@konecta/types";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

const STATUS_LABEL: Record<CompanyVerificationStatus, string> = {
  PENDING: "Pendente",
  VERIFIED: "Verificada",
  REJECTED: "Rejeitada",
};

export default function CompaniesPage() {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!accessToken || !user?.isAdmin) return;
    api
      .listCompanies(accessToken)
      .then(setCompanies)
      .catch(() => setError("Falha ao carregar empresas"))
      .finally(() => setLoadingList(false));
  }, [accessToken, user]);

  const handleChangeStatus = async (
    company: Company,
    status: CompanyVerificationStatus,
  ) => {
    if (!accessToken) return;
    setUpdatingId(company.id);
    setError(null);
    try {
      const updated = await api.updateCompanyVerification(
        accessToken,
        company.id,
        status,
      );
      setCompanies((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
    } catch {
      setError("Falha ao atualizar status da empresa");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading || !user?.isAdmin) {
    return <main style={{ padding: 24 }}>Carregando...</main>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h1>Empresas</h1>
      {error && <p style={{ color: "#c0392b" }}>{error}</p>}
      {loadingList ? (
        <p>Carregando...</p>
      ) : companies.length === 0 ? (
        <p>Nenhuma empresa cadastrada ainda.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Nome comercial</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Cidade</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Status</th>
              <th style={{ borderBottom: "1px solid #ccc" }}></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: "6px 0" }}>{c.tradeName}</td>
                <td>{c.city ?? "—"}</td>
                <td>{STATUS_LABEL[c.verificationStatus]}</td>
                <td>
                  {c.verificationStatus !== "VERIFIED" && (
                    <button
                      disabled={updatingId === c.id}
                      onClick={() => handleChangeStatus(c, "VERIFIED")}
                      style={{ padding: 4, marginRight: 4 }}
                    >
                      Verificar
                    </button>
                  )}
                  {c.verificationStatus !== "REJECTED" && (
                    <button
                      disabled={updatingId === c.id}
                      onClick={() => handleChangeStatus(c, "REJECTED")}
                      style={{ padding: 4 }}
                    >
                      Rejeitar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

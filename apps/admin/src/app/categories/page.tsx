"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@konecta/types";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

export default function CategoriesPage() {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!accessToken || !user?.isAdmin) return;
    api
      .listCategoriesAdmin(accessToken)
      .then(setCategories)
      .catch(() => setFormError("Falha ao carregar categorias"))
      .finally(() => setLoadingList(false));
  }, [accessToken, user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setFormError(null);
    setSubmitting(true);
    try {
      const created = await api.createCategory(accessToken, {
        name,
        slug,
        parentId: parentId || undefined,
      });
      setCategories((prev) => [...prev, created]);
      setName("");
      setSlug("");
      setParentId("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Falha ao criar categoria");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    if (!accessToken) return;
    try {
      const updated = await api.updateCategory(accessToken, category.id, {
        active: !category.active,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
    } catch {
      setFormError("Falha ao atualizar categoria");
    }
  };

  if (isLoading || !user?.isAdmin) {
    return <main style={{ padding: 24 }}>Carregando...</main>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 700 }}>
      <h1>Categorias</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16 }}>Nova categoria</h2>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 8, width: "100%" }}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Slug (ex: mecanica)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={{ padding: 8, width: "100%" }}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            style={{ padding: 8, width: "100%" }}
          >
            <option value="">Sem categoria pai</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {formError && <p style={{ color: "#c0392b" }}>{formError}</p>}
        <button type="submit" disabled={submitting} style={{ padding: 10 }}>
          {submitting ? "Criando..." : "Criar categoria"}
        </button>
      </form>

      <h2 style={{ fontSize: 16 }}>Todas as categorias</h2>
      {loadingList ? (
        <p>Carregando...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Nome</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Slug</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Pai</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Status</th>
              <th style={{ borderBottom: "1px solid #ccc" }}></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: "6px 0" }}>{c.name}</td>
                <td>{c.slug}</td>
                <td>
                  {categories.find((p) => p.id === c.parentId)?.name ?? "—"}
                </td>
                <td>{c.active ? "Ativa" : "Inativa"}</td>
                <td>
                  <button onClick={() => handleToggleActive(c)} style={{ padding: 4 }}>
                    {c.active ? "Desativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

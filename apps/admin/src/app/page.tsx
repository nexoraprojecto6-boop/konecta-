"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <main style={{ padding: 24 }}>Carregando...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>KONECTA — Admin</h1>
      <p>Bem-vindo, {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Região: {user.region === "AO" ? "Angola" : "Moçambique"}</p>

      {user.isAdmin ? (
        <nav style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16 }}>KONECTA Discovery</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li>
              <Link href="/categories">Categorias</Link>
            </li>
            <li>
              <Link href="/professionals">Profissionais</Link>
            </li>
            <li>
              <Link href="/companies">Empresas</Link>
            </li>
            <li>
              <Link href="/services">Serviços</Link>
            </li>
          </ul>
        </nav>
      ) : (
        <p style={{ marginTop: 24, color: "#666" }}>
          Sua conta não tem permissão de administrador.
        </p>
      )}

      <button
        onClick={() => {
          void logout();
        }}
        style={{ marginTop: 24, padding: 10 }}
      >
        Sair
      </button>
    </main>
  );
}

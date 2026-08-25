import React from "react";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "KONECTA Admin",
  description: "Painel administrativo da plataforma KONECTA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

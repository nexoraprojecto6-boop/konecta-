import React from "react";

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
      <body>{children}</body>
    </html>
  );
}

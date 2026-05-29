import "./globals.css";

export const metadata = {
  title: "VIRAL · Análise de Instagram",
  description:
    "Conecte sua conta do Instagram e receba uma análise completa com recomendações de melhoria.",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

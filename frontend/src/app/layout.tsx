import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Importação dinâmica dos componentes pesados
const Providers = dynamic(() => import("./providers"), {
  ssr: true
});

// Carregamento dinâmico do layout para melhor performance
const AppLayout = dynamic(() => import("@/components/layout/AppLayout"), {
  loading: () => <div className="app-loading">Carregando...</div>,
  ssr: true
});

// Importação do componente de diagnóstico do lado do cliente
const ClientComponents = dynamic(() => import("./ClientComponents"));

// Configurando a fonte para ser precarregada e auto-otimizada
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// Definições de viewport (separado de metadata conforme recomendação do Next.js 15)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3f51b5",
  colorScheme: "light",
};

// Metadados do aplicativo
export const metadata: Metadata = {
  title: "Innerview Ilhabela | Sistema de Gestão Educacional",
  description: "Plataforma de gestão educacional com recursos de inteligência artificial para análise de desempenho e recomendações personalizadas.",
  keywords: "educação, gestão educacional, analytics, desempenho escolar, IA educacional",
  authors: [{ name: "Equipe Innerview", url: "https://innerview-ilhabela.edu.br" }],
  creator: "Innerview Ilhabela",
  applicationName: "Innerview Ilhabela",
  robots: "index, follow",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={<div className="app-loading">Carregando aplicativo...</div>}>
          <Providers>
            <AppLayout title="Innerview Ilhabela">{children}</AppLayout>
          </Providers>
        </Suspense>
        {process.env.NODE_ENV === 'development' && <ClientComponents />}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "freelanceos - Gestión para freelancers",
    template: "%s | freelanceos",
  },
  description: "Gestiona clientes, proyectos, tiempo y facturas en un solo lugar. 100% gratuito y sin límites.",
  keywords: ["freelance", "gestión", "clientes", "proyectos", "facturas", "time tracking", "gratis", "SaaS"],
  authors: [{ name: "Webward Labs" }],
  creator: "Webward Labs",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://freelanceos.pages.dev",
    siteName: "freelanceos",
    title: "freelanceos - Gestión para freelancers",
    description: "Gestiona clientes, proyectos, tiempo y facturas en un solo lugar. 100% gratuito.",
  },
  twitter: {
    card: "summary_large_image",
    title: "freelanceos - Gestión para freelancers",
    description: "Gestiona clientes, proyectos, tiempo y facturas en un solo lugar. 100% gratuito.",
    creator: "@webwardlabs",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

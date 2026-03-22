import Link from "next/link";
import { Heart, Users, Clock, FileText, BarChart3, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "freelanceos - Gestión para freelancers",
  description: "Gestiona clientes, proyectos, tiempo y facturas en un solo lugar. 100% gratuito y sin límites para freelancers.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">f</span>
            </div>
            <span className="font-bold text-xl">freelanceos</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium hover:text-blue-600 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Comenzar gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            100% Gratuito - Sin planes de pago
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestiona tu negocio como{" "}
            <span className="text-blue-600">freelancer</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Clientes, proyectos, tiempo y facturas en un solo lugar.
            Simple, práctico y gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
            >
              Empezar ahora - Es gratis
            </Link>
            <a
              href="https://ko-fi.com/webwardlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-amber-100 text-amber-800 px-8 py-4 rounded-lg font-medium text-lg hover:bg-amber-200 transition"
            >
              <Heart className="w-5 h-5 mr-2" />
              Apoyar el proyecto
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Todo lo que necesitas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Clientes"
              description="Mantén toda la información de tus clientes organizada: contacto, historial y notas."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Control de Tiempo"
              description="Registra tus horas con timer o manualmente. Informes semanales y mensuales."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Facturas"
              description="Crea facturas, lleva el control de estados y exporta CSV."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Dashboard"
              description="Visualiza tus métricas: ingresos, horas trabajadas y proyectos activos."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Seguro y Privado"
              description="Tus datos son tuyos. Implementamos las mejores prácticas de seguridad."
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="100% Gratuito"
              description="Sin límites, sin paywalls. Si te es útil, puedes apoyar con una donación."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Empieza a organizar tu negocio hoy
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a otros freelancers que ya usan freelanceos para gestionar su negocio.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-50 transition"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">f</span>
              </div>
              <span className="font-medium">freelanceos</span>
            </div>
            <p className="text-sm text-gray-500">
              Hecho con ❤️ para freelancers
            </p>
            <a
              href="https://ko-fi.com/webwardlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              ☕ Apoya con un cafecito
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border bg-white hover:shadow-lg transition">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

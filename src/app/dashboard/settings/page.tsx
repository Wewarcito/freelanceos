"use client";

import { Settings, User, Heart, Shield, Coffee, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import SupporterBadge, { TierShowcase } from "@/components/supporter-badge";

export default function SettingsPage() {
  const [isSupporter, setIsSupporter] = useState(false);
  const [supporterTier, setSupporterTier] = useState<string>("coffee");
  const [showClaimSection, setShowClaimSection] = useState(false);

  useEffect(() => {
    const tier = localStorage.getItem("supporter_tier");
    if (tier) {
      setIsSupporter(true);
      setSupporterTier(tier);
    }
  }, []);

  const handleClaimBadge = (tier: string) => {
    localStorage.setItem("supporter_tier", tier);
    setIsSupporter(true);
    setSupporterTier(tier);
    setShowClaimSection(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Administra tu cuenta y preferencias</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Perfil</h2>
              <p className="text-sm text-gray-500">Tu información personal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-500 text-sm flex-1">
              Gestiona tu perfil desde la configuración de tu cuenta. Los cambios se reflejarán automáticamente.
            </p>
            {isSupporter && (
              <SupporterBadge tier={supporterTier as any} size="md" />
            )}
          </div>
        </div>

        {/* Supporter Status Section */}
        <div className={`rounded-xl border p-6 ${isSupporter ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">Estado de Supporter</h2>
              <p className="text-sm text-gray-600 mt-1">
                {isSupporter
                  ? "¡Eres un supporter de freelanceos! Tu badge aparece en tu perfil."
                  : "Apoya el proyecto y recibe un badge especial en tu perfil."}
              </p>
            </div>
            {isSupporter && (
              <SupporterBadge tier={supporterTier as any} size="lg" />
            )}
          </div>

          {!isSupporter && (
            <>
              {showClaimSection ? (
                <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Selecciona tu nivel de donación:
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => handleClaimBadge("coffee")}
                      className="flex items-center gap-2 p-3 rounded-lg border-2 border-amber-200 hover:border-amber-400 transition"
                    >
                      <span className="text-lg">☕</span>
                      <div className="text-left">
                        <p className="font-medium text-sm">Coffee</p>
                        <p className="text-xs text-gray-500">$1-4</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleClaimBadge("bronze")}
                      className="flex items-center gap-2 p-3 rounded-lg border-2 border-orange-200 hover:border-orange-400 transition"
                    >
                      <span className="text-lg">🥉</span>
                      <div className="text-left">
                        <p className="font-medium text-sm">Supporter</p>
                        <p className="text-xs text-gray-500">$5-9</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleClaimBadge("silver")}
                      className="flex items-center gap-2 p-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition"
                    >
                      <span className="text-lg">🥈</span>
                      <div className="text-left">
                        <p className="font-medium text-sm">Champion</p>
                        <p className="text-xs text-gray-500">$10-19</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleClaimBadge("gold")}
                      className="flex items-center gap-2 p-3 rounded-lg border-2 border-yellow-300 hover:border-yellow-400 transition"
                    >
                      <span className="text-lg">🥇</span>
                      <div className="text-left">
                        <p className="font-medium text-sm">Hero</p>
                        <p className="text-xs text-gray-500">$20+</p>
                      </div>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowClaimSection(false)}
                      className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <a
                      href="https://ko-fi.com/webwardlabs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-amber-600 transition"
                    >
                      Ir a Ko-fi
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href="https://ko-fi.com/webwardlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
                  >
                    <Heart className="w-4 h-4" />
                    Donar en Ko-fi
                  </a>
                  <button
                    onClick={() => setShowClaimSection(true)}
                    className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Ya doné - Activar badge
                  </button>
                </div>
              )}
            </>
          )}

          {isSupporter && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <p className="text-xs text-gray-500">
                Badge basado en autodeclaración. Para actualizar, contacta a soporte.
              </p>
            </div>
          )}
        </div>

        {/* Donations Info Section */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">¿Por qué donate?</h2>
              <p className="text-sm text-gray-600">
                freelanceos es 100% gratuito y sin límites. Tu apoyo ayuda a cubrir
                los costos del servidor y motiva el desarrollo continuo.
              </p>
            </div>
          </div>
          <TierShowcase />
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Seguridad</h2>
              <p className="text-sm text-gray-500">Gestiona tu contraseña y sesiones</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            La seguridad de tu cuenta es gestionada a través de Auth.js.
          </p>
        </div>
      </div>
    </div>
  );
}

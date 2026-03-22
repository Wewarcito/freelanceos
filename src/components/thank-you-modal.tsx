"use client";

import { useEffect, useState } from "react";
import { Heart, X, Coffee } from "lucide-react";
import SupporterBadge from "./supporter-badge";

const TIER_OPTIONS = [
  { tier: "coffee" as const, label: "Coffee ☕", range: "$1-4" },
  { tier: "bronze" as const, label: "Supporter 🥉", range: "$5-9" },
  { tier: "silver" as const, label: "Champion 🥈", range: "$10-19" },
  { tier: "gold" as const, label: "Hero 🥇", range: "$20+" },
];

export default function ThankYouModal() {
  const [show, setShow] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const donated = localStorage.getItem("kofi_donated");
      if (donated) {
        setShow(true);
        localStorage.removeItem("kofi_donated");
      }
    }
  }, []);

  if (!show) return null;

  const handleConfirmDonation = () => {
    if (selectedTier) {
      setShowBadge(true);
    }
  };

  const handleClose = () => {
    setShow(false);
    setShowBadge(false);
    setSelectedTier(null);
  };

  if (showBadge) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Gracias por tu apoyo! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Tu donación ayuda a mantener freelanceos gratuito para todos.
          </p>
          <div className="flex justify-center mb-6">
            <SupporterBadge tier={selectedTier as any} size="lg" />
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Tu badge se mostrará en tu perfil y en el dashboard.
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            ¡Gracias por tu donación! ☕
          </h2>
          <p className="text-gray-600 mt-2">
            Para activar tu badge, selecciona el nivel de tu donación:
          </p>
        </div>

        <div className="space-y-2 mb-6">
          {TIER_OPTIONS.map((option) => (
            <button
              key={option.tier}
              onClick={() => setSelectedTier(option.tier)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition ${
                selectedTier === option.tier
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <SupporterBadge tier={option.tier} showLabel={false} />
                <span className="font-medium">{option.label}</span>
              </div>
              <span className="text-sm text-gray-500">{option.range}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirmDonation}
          disabled={!selectedTier}
          className={`w-full py-3 rounded-lg font-medium transition ${
            selectedTier
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Activar Badge
        </button>
      </div>
    </div>
  );
}

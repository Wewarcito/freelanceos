"use client";

interface SupporterBadgeProps {
  tier: "coffee" | "bronze" | "silver" | "gold";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const BADGE_TIERS = {
  coffee: {
    label: "Coffee",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "☕",
  },
  bronze: {
    label: "Supporter",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "🥉",
  },
  silver: {
    label: "Champion",
    color: "bg-gray-200 text-gray-700 border-gray-300",
    icon: "🥈",
  },
  gold: {
    label: "Hero",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: "🥇",
  },
};

export default function SupporterBadge({
  tier,
  showLabel = true,
  size = "md",
}: SupporterBadgeProps) {
  const badge = BADGE_TIERS[tier];

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 gap-1",
    md: "text-sm px-2 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${badge.color} ${sizeClasses[size]}`}
      title="¡Este usuario apoya freelanceos!"
    >
      <span className={iconSizes[size]}>{badge.icon}</span>
      {showLabel && <span>{badge.label}</span>}
    </span>
  );
}

export function TierShowcase() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Apoya freelanceos y recibe un badge especial en tu perfil:
      </p>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(BADGE_TIERS).map(([tier, config]) => (
          <div
            key={tier}
            className={`flex items-center gap-2 p-3 rounded-lg border ${config.color}`}
          >
            <span className="text-lg">{config.icon}</span>
            <div>
              <p className="font-medium capitalize">{tier}</p>
              <p className="text-xs opacity-75">
                {tier === "coffee" && "$1-4"}
                {tier === "bronze" && "$5-9"}
                {tier === "silver" && "$10-19"}
                {tier === "gold" && "$20+"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

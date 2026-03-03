import type { StartupPricingTier } from "@/types";
import { Zap, Star } from "lucide-react";

interface TierBadgeProps {
  tier: StartupPricingTier;
  size?: "sm" | "md";
}

const TIER_STYLES: Record<StartupPricingTier, {
  textColor: string; bgColor: string; borderColor: string;
  glow?: string; label: string;
}> = {
  core: {
    textColor: "rgba(255,255,255,0.35)",
    bgColor:   "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.09)",
    label: "Core",
  },
  plus: {
    textColor: "rgba(147,197,253,0.9)",
    bgColor:   "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.28)",
    label: "Plus",
  },
  ultra: {
    textColor: "rgba(253,211,77,0.95)",
    bgColor:   "rgba(245,158,11,0.13)",
    borderColor: "rgba(245,158,11,0.35)",
    glow: "0 0 8px rgba(245,158,11,0.18)",
    label: "Ultra",
  },
};

export function TierBadge({ tier, size = "md" }: TierBadgeProps) {
  const s = TIER_STYLES[tier];
  const iconSize = size === "sm" ? 9 : 11;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        borderRadius: 999,
        fontWeight: 600,
        border: `1px solid ${s.borderColor}`,
        color: s.textColor,
        background: s.bgColor,
        boxShadow: s.glow,
        padding: size === "sm" ? "1px 7px" : "3px 9px",
        fontSize: size === "sm" ? 10 : 11,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {tier === "ultra" && <Star size={iconSize} style={{ flexShrink: 0 }} />}
      {tier === "plus"  && <Zap  size={iconSize} style={{ flexShrink: 0 }} />}
      {s.label}
    </span>
  );
}

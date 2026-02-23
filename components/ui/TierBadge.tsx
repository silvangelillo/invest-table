import { cn } from "@/lib/utils";
import { TIER_CONFIG } from "@/types";
import type { StartupPricingTier } from "@/types";
import { Zap, Star } from "lucide-react";

interface TierBadgeProps {
  tier: StartupPricingTier;
  size?: "sm" | "md";
}

export function TierBadge({ tier, size = "md" }: TierBadgeProps) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-semibold border",
      cfg.color, cfg.bg, cfg.border,
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
    )}>
      {tier === "ultra" && <Star className="w-3 h-3" />}
      {tier === "plus"  && <Zap  className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}

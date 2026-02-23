import type { StartupPricingTier, Startup } from "@/types";

// ─── Feature gate definitions ─────────────────────────────────────────────────
export const STARTUP_FEATURES = {
  // Available to all tiers
  visible_on_map:     ["core", "plus", "ultra"],
  searchable:         ["core", "plus", "ultra"],
  can_be_favorited:   ["core", "plus", "ultra"],

  // Plus and above
  alert_inclusion:    ["plus", "ultra"],
  saved_search_match: ["plus", "ultra"],
  full_filter:        ["plus", "ultra"],

  // Ultra only
  ranking_boost:      ["ultra"],
  featured_badge:     ["ultra"],
} as const;

export type StartupFeature = keyof typeof STARTUP_FEATURES;

// ─── Check if a startup tier has access to a feature ─────────────────────────
export function startupCanAccess(
  tier: StartupPricingTier,
  feature: StartupFeature
): boolean {
  return (STARTUP_FEATURES[feature] as readonly string[]).includes(tier);
}

// ─── Check if a startup should be included in alert matching ──────────────────
export function isEligibleForAlerts(startup: Pick<Startup, "pricing_tier">): boolean {
  return startupCanAccess(startup.pricing_tier, "alert_inclusion");
}

// ─── Check if a startup gets ranking boost ───────────────────────────────────
export function hasRankingBoost(startup: Pick<Startup, "pricing_tier">): boolean {
  return startupCanAccess(startup.pricing_tier, "ranking_boost");
}

// ─── Get all features available for a tier ───────────────────────────────────
export function getFeaturesForTier(tier: StartupPricingTier): StartupFeature[] {
  return (Object.entries(STARTUP_FEATURES) as [StartupFeature, readonly string[]][])
    .filter(([, tiers]) => tiers.includes(tier))
    .map(([feature]) => feature);
}

// ─── Server-side guard: throw if feature not allowed ─────────────────────────
export function requireStartupFeature(
  tier: StartupPricingTier,
  feature: StartupFeature
): void {
  if (!startupCanAccess(tier, feature)) {
    throw new Error(
      `Feature '${feature}' is not available on the '${tier}' plan. Upgrade to access this feature.`
    );
  }
}

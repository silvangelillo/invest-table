import type { Startup, RankingScore } from "@/types";

// ─── Funding stage weights ────────────────────────────────────────────────────
const FUNDING_WEIGHTS: Record<string, number> = {
  "Pre-seed": 0.6,
  "Seed":     0.75,
  "Series A": 0.88,
  "Series B+": 1.0,
};

// ─── Ultra boost rules ────────────────────────────────────────────────────────
const ULTRA_BOOST_PER_MONTH = 0.03;
const ULTRA_BOOST_CAP        = 1.25; // max 25% increase — never pay-to-win infinite

function getUltraMultiplier(startup: Startup): number {
  if (startup.pricing_tier !== "ultra" || !startup.tier_started_at) return 1.0;
  const start  = new Date(startup.tier_started_at);
  const now    = new Date();
  const months = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  const boost  = 1 + months * ULTRA_BOOST_PER_MONTH;
  return Math.min(boost, ULTRA_BOOST_CAP);
}

// ─── Core tier penalty (still visible, just slightly lower) ──────────────────
const CORE_BASE_MULTIPLIER = 0.9;

// ─── Individual score components ─────────────────────────────────────────────

function fundingStageWeight(startup: Startup): number {
  return FUNDING_WEIGHTS[startup.funding_stage] ?? 0.5;
}

function recencyWeight(startup: Startup): number {
  const ageMonths = Math.floor(
    (Date.now() - new Date(startup.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  // Decays from 1.0 to 0.3 over 24 months
  return Math.max(0.3, 1.0 - ageMonths * 0.03);
}

function activityWeight(startup: Startup): number {
  // Profile completeness drives activity score
  const completeness = (startup.profile_completeness_score ?? 0) / 100;
  return 0.4 + completeness * 0.6;
}

function investorInterestWeight(startup: Startup): number {
  const hearts = startup.heart_count ?? 0;
  // Log scale: 0 hearts = 0, 1 = 0.2, 10 = 0.46, 100 = 0.66
  return hearts > 0 ? Math.min(1.0, Math.log10(hearts + 1) / 2.3) : 0;
}

function engagementWeight(startup: Startup): number {
  // Profile completeness as a proxy for engagement
  const completeness = (startup.profile_completeness_score ?? 0) / 100;
  const hasDeck      = startup.pitch_deck_url ? 0.15 : 0;
  const hasWebsite   = startup.website_url ? 0.1 : 0;
  const hasFinancials = (startup.revenue_last_12m != null) ? 0.1 : 0;
  return Math.min(1.0, completeness * 0.65 + hasDeck + hasWebsite + hasFinancials);
}

// ─── Main ranking engine ──────────────────────────────────────────────────────
export function computeRankingScore(startup: Startup): RankingScore {
  const fw  = fundingStageWeight(startup);
  const rw  = recencyWeight(startup);
  const aw  = activityWeight(startup);
  const iiw = investorInterestWeight(startup);
  const ew  = engagementWeight(startup);

  // Weighted base score (all components 0–1)
  const base_score =
    fw  * 0.25 +
    rw  * 0.20 +
    aw  * 0.20 +
    iiw * 0.25 +
    ew  * 0.10;

  // Apply tier adjustments
  const core_adj        = startup.pricing_tier === "core" ? CORE_BASE_MULTIPLIER : 1.0;
  const tier_multiplier = startup.pricing_tier === "ultra"
    ? getUltraMultiplier(startup)
    : core_adj;

  const final_score = base_score * tier_multiplier;

  return {
    startup_id:              startup.id,
    base_score:              parseFloat(base_score.toFixed(4)),
    funding_stage_weight:    parseFloat(fw.toFixed(4)),
    recency_weight:          parseFloat(rw.toFixed(4)),
    activity_weight:         parseFloat(aw.toFixed(4)),
    investor_interest_weight: parseFloat(iiw.toFixed(4)),
    engagement_weight:       parseFloat(ew.toFixed(4)),
    tier_multiplier:         parseFloat(tier_multiplier.toFixed(4)),
    final_score:             parseFloat(final_score.toFixed(4)),
  };
}

// ─── Sort a list of startups by ranking score ─────────────────────────────────
export function rankStartups(startups: Startup[]): Startup[] {
  return [...startups]
    .map((s) => ({ ...s, ranking_score: computeRankingScore(s).final_score }))
    .sort((a, b) => (b.ranking_score ?? 0) - (a.ranking_score ?? 0));
}

// ─── Profile completeness calculator ─────────────────────────────────────────
export function computeProfileCompleteness(startup: Partial<Startup>): number {
  const checks = [
    !!startup.name,
    !!startup.tagline,
    !!startup.short_description,
    !!startup.category,
    !!startup.city,
    !!startup.country,
    !!startup.founded_year,
    !!startup.team_size,
    !!startup.funding_stage,
    !!startup.gdpr_compliant,
    !!startup.pitch_deck_url,
    !!startup.website_url,
    startup.revenue_last_12m != null,
    startup.revenue_cagr_3y  != null,
    (startup.secondary_categories?.length ?? 0) > 0,
  ];
  const score = checks.filter(Boolean).length / checks.length;
  return Math.round(score * 100);
}

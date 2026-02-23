// ─── Categories ───────────────────────────────────────────────────────────────
export type StartupCategory = "Tech" | "Food" | "Service" | "Sustainability";

export type StartupSecondaryCategory =
  | "SaaS" | "DeepTech" | "AI" | "VR" | "AR"
  | "ClimateTech" | "FinTech" | "HealthTech" | "Robotics"
  | "Marketplace" | "B2B" | "B2C" | "Hardware" | "Biotech";

// ─── Pricing Tiers ────────────────────────────────────────────────────────────
export type StartupPricingTier = "core" | "plus" | "ultra";

export const TIER_CONFIG: Record<StartupPricingTier, {
  label: string;
  price: number;
  color: string;
  bg: string;
  border: string;
  features: string[];
}> = {
  core: {
    label: "Core",
    price: 0,
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    features: ["Visible on map", "Searchable", "Can be favorited"],
  },
  plus: {
    label: "Plus",
    price: 39,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    features: ["All Core features", "Alert inclusion", "Full filter inclusion", "Normal ranking weight"],
  },
  ultra: {
    label: "Ultra",
    price: 79,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    features: ["All Plus features", "Featured badge", "Ranking boost (capped 25%)", "Longevity multiplier"],
  },
};

// ─── Startup ──────────────────────────────────────────────────────────────────
export interface Startup {
  id: string;
  name: string;
  tagline: string;
  short_description?: string;
  category: StartupCategory;
  secondary_categories?: StartupSecondaryCategory[];
  city: string;
  country: string;
  lat: number;
  lng: number;
  pitch_deck_url: string | null;
  gdpr_compliant: boolean;
  founded_year: number;
  team_size: number;
  employee_count?: number;
  funding_stage: "Pre-seed" | "Seed" | "Series A" | "Series B+";
  pricing_tier: StartupPricingTier;
  tier_started_at?: string;
  website_url?: string;
  revenue_last_12m?: number;
  revenue_cagr_3y?: number;
  verified_financials: boolean;
  profile_completeness_score: number;
  ranking_score?: number;
  heart_count?: number;
  created_at: string;
  investor_id?: string;
}

// ─── Investor Organization ────────────────────────────────────────────────────
export interface InvestorOrganization {
  id: string;
  name: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  purchased_seats: number;
  created_at: string;
}

export type InvestorRole = "admin" | "member";
export type SeatStatus = "active" | "inactive";

export interface InvestorUser {
  id: string;
  organization_id: string;
  email: string;
  role: InvestorRole;
  seat_status: SeatStatus;
  session_token_hash: string | null;
  last_login_at: string | null;
  created_at: string;
}

// ─── Legacy Investor ──────────────────────────────────────────────────────────
export interface Investor {
  id: string;
  name: string;
  email: string;
  stripe_customer_id: string | null;
  subscription_status: "active" | "trialing" | "past_due" | "canceled" | null;
  created_at: string;
}

// ─── Favorites ────────────────────────────────────────────────────────────────
export interface Favorite {
  id: string;
  investor_user_id: string;
  startup_id: string;
  created_at: string;
}

// ─── Alert / Saved Search ─────────────────────────────────────────────────────
export interface SavedSearch {
  id: string;
  investor_id: string;
  label: string;
  filters: SearchFilters;
  alerts_enabled: boolean;
  created_at: string;
}

export interface SearchFilters {
  categories?: StartupCategory[];
  secondary_categories?: StartupSecondaryCategory[];
  city?: string;
  country?: string;
  funding_stage?: string;
  min_team_size?: number;
  max_team_size?: number;
  pricing_tier?: StartupPricingTier[];
  min_revenue?: number;
  max_revenue?: number;
  min_cagr?: number;
  max_cagr?: number;
  min_employees?: number;
  max_employees?: number;
}

// ─── Ranking ──────────────────────────────────────────────────────────────────
export interface RankingScore {
  startup_id: string;
  base_score: number;
  funding_stage_weight: number;
  recency_weight: number;
  activity_weight: number;
  investor_interest_weight: number;
  engagement_weight: number;
  tier_multiplier: number;
  final_score: number;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────
export type AuditAction =
  | "seat_activated"
  | "seat_deactivated"
  | "tier_changed"
  | "revenue_edited"
  | "concurrent_session_flagged";

export interface AuditLog {
  id: string;
  actor_id: string;
  action: AuditAction;
  target_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Map ──────────────────────────────────────────────────────────────────────
export interface MapMarker extends Startup {
  visible: boolean;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  startup_id: string;
  read: boolean;
  created_at: string;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
export interface OnboardingFormData {
  name: string;
  tagline: string;
  short_description: string;
  category: StartupCategory;
  secondary_categories: StartupSecondaryCategory[];
  founded_year: number;
  team_size: number;
  employee_count: number;
  funding_stage: Startup["funding_stage"];
  website_url: string;
  revenue_last_12m: number | null;
  revenue_cagr_3y: number | null;
  city: string;
  country: string;
  lat: number;
  lng: number;
  pitch_deck_file: File | null;
  pitch_deck_url: string | null;
  gdpr_compliant: boolean;
  pricing_tier: StartupPricingTier;
}

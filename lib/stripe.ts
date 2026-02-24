import { loadStripe } from "@stripe/stripe-js";

let stripePromise: ReturnType<typeof loadStripe>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_mock"
    );
  }
  return stripePromise;
}

export const PLANS: Record<string, {
  name: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  interval: string;
  features: string[];
}> = {
  "investor-plus": {
    name: "Investor Plus",
    price: 39,
    yearlyPrice: 32,
    currency: "EUR",
    interval: "month",
    features: [
      "Full EU startup map access",
      "Up to 10 saved searches",
      "Real-time alerts & notifications",
      "Full startup profiles (Revenue, CAGR)",
      "Advanced filters",
      "Multi-seat & org management",
      "CSV export",
    ],
  },
  "investor-pro": {
    name: "Investor Pro",
    price: 59,
    yearlyPrice: 49,
    currency: "EUR",
    interval: "month",
    features: [
      "Everything in Plus",
      "Unlimited saved searches",
      "Priority alert delivery",
      "Analytics dashboard",
      "API access (1000 req/day)",
      "Bulk export",
      "Audit logs & dedicated support",
    ],
  },
  "startup-plus": {
    name: "Startup Plus",
    price: 39,
    yearlyPrice: 32,
    currency: "EUR",
    interval: "month",
    features: [
      "Included in investor alerts",
      "Full profile visible to investors",
      "Pitch deck upload",
      "Appears in all saved searches",
      "Profile analytics",
      "14-day free trial",
    ],
  },
  "startup-ultra": {
    name: "Startup Ultra",
    price: 79,
    yearlyPrice: 65,
    currency: "EUR",
    interval: "month",
    features: [
      "Everything in Plus",
      "Ranking boost (capped at +25%)",
      "Featured badge on profile",
      "Longevity multiplier",
      "Extended analytics",
      "Priority support",
    ],
  },
};

// Fallback for legacy usage
export const PLAN = PLANS["investor-plus"];


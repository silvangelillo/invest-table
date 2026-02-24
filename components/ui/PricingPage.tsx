"use client";

import { useState } from "react";
import { Check, ChevronRight, Shield, Building2, TrendingUp, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type BillingInterval = "monthly" | "yearly";

interface PlanFeature {
  text: string;
  included: boolean;
  note?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  yearlyPrice?: number;
  unit?: string;
  badge?: string;
  recommended?: boolean;
  cta: string;
  ctaHref: string;
  yearlyCtaHref?: string;
  color: string;
  borderColor: string;
  bgColor: string;
  features: PlanFeature[];
  isInvestor?: boolean;
}

// ─── Discount helpers ─────────────────────────────────────────────────────────
function getSeatDiscount(seats: number): { pct: number; label: string } {
  if (seats >= 25) return { pct: 15, label: "15% off" };
  if (seats >= 10) return { pct: 10, label: "10% off" };
  return { pct: 0, label: "" };
}

function getNextDiscountHint(seats: number): string | null {
  if (seats < 10) {
    const needed = 10 - seats;
    return `Add ${needed} more seat${needed > 1 ? "s" : ""} to get 10% off`;
  }
  if (seats < 25) {
    const needed = 25 - seats;
    return `Add ${needed} more seat${needed > 1 ? "s" : ""} to get 15% off`;
  }
  return null;
}

// ─── Investor Plans ───────────────────────────────────────────────────────────
const INVESTOR_PLANS: Plan[] = [
  {
    id: "investor-core",
    name: "Core",
    price: 0,
    unit: "free",
    cta: "Start free",
    ctaHref: "/login",
    yearlyCtaHref: "/login",
    color: "text-gray-700",
    borderColor: "border-gray-200",
    bgColor: "bg-gray-50",
    isInvestor: true,
    features: [
      { text: "Browse all startups on map", included: true },
      { text: "Basic filters (category + stage)", included: true },
      { text: "View name, tagline, location", included: true },
      { text: "Heart / favorite startups", included: true },
      { text: "1 saved search", included: true },
      { text: "Single user only", included: true },
      { text: "Alert creation", included: false },
      { text: "Revenue & financial data", included: false },
      { text: "Advanced filters", included: false },
      { text: "Team seat management", included: false },
      { text: "CSV export", included: false },
    ],
  },
  {
    id: "investor-plus",
    name: "Plus",
    price: 39,
    yearlyPrice: 32,
    unit: "seat / month",
    recommended: true,
    badge: "Most popular",
    cta: "Start scouting",
    ctaHref: "/checkout?plan=investor-plus&interval=monthly",
    yearlyCtaHref: "/checkout?plan=investor-plus&interval=yearly",
    color: "text-blue-700",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-600",
    isInvestor: true,
    features: [
      { text: "Everything in Core", included: true },
      { text: "Alerts for new matching startups", included: true },
      { text: "Up to 10 saved searches", included: true },
      { text: "Full startup profiles", included: true, note: "Revenue, CAGR, employees" },
      { text: "Advanced filters", included: true, note: "Revenue, CAGR, size, sub-category" },
      { text: "Multi-seat & org management", included: true },
      { text: "Admin seat activate/deactivate", included: true },
      { text: "CSV export of filtered results", included: true },
      { text: "Unlimited saved searches", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    id: "investor-pro",
    name: "Pro",
    price: 59,
    yearlyPrice: 49,
    unit: "seat / month",
    badge: "Deal teams",
    cta: "Equip your team",
    ctaHref: "/checkout?plan=investor-pro&interval=monthly",
    yearlyCtaHref: "/checkout?plan=investor-pro&interval=yearly",
    color: "text-indigo-700",
    borderColor: "border-indigo-300",
    bgColor: "bg-indigo-600",
    isInvestor: true,
    features: [
      { text: "Everything in Plus", included: true },
      { text: "Unlimited saved searches", included: true },
      { text: "Priority alert delivery", included: true },
      { text: "Analytics dashboard", included: true, note: "Trending, heatmap, top favorites" },
      { text: "API access (read-only)", included: true, note: "1000 req/day · startup data" },
      { text: "Bulk export", included: true },
      { text: "Concurrent session monitoring", included: true },
      { text: "Audit logs for seat usage", included: true },
      { text: "Dedicated support", included: true },
    ],
  },
];

// ─── Startup Plans ────────────────────────────────────────────────────────────
const STARTUP_PLANS: Plan[] = [
  {
    id: "startup-core",
    name: "Core",
    price: 0,
    unit: "free forever",
    cta: "Get on the map",
    ctaHref: "/onboarding",
    yearlyCtaHref: "/onboarding",
    color: "text-gray-700",
    borderColor: "border-gray-200",
    bgColor: "bg-gray-50",
    features: [
      { text: "Visible on map & search", included: true },
      { text: "Basic profile (name, tagline, location)", included: true },
      { text: "Can be favorited by investors", included: true },
      { text: "Category & stage filtering", included: true },
      { text: "Optional financial data", included: true, note: "Lower visibility" },
      { text: "Included in investor alerts", included: false },
      { text: "Pitch deck upload", included: false },
      { text: "Profile analytics", included: false },
      { text: "Full profile visibility", included: false },
      { text: "Ranking boost", included: false },
    ],
  },
  {
    id: "startup-plus",
    name: "Plus",
    price: 39,
    yearlyPrice: 32,
    unit: "/ month",
    recommended: true,
    badge: "Recommended",
    cta: "Start raising",
    ctaHref: "/checkout?plan=startup-plus&interval=monthly",
    yearlyCtaHref: "/checkout?plan=startup-plus&interval=yearly",
    color: "text-blue-700",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-600",
    features: [
      { text: "Everything in Core", included: true },
      { text: "Included in investor alerts", included: true },
      { text: "Full profile visible to investors", included: true, note: "Revenue, CAGR, website, deck" },
      { text: "Pitch deck upload (optional)", included: true },
      { text: "Appears in all saved searches", included: true },
      { text: "Normal ranking weight", included: true },
      { text: "Profile analytics", included: true, note: "Views, hearts, alert triggers" },
      { text: "Mark financials as self-reported", included: true },
      { text: "14-day free trial", included: true },
      { text: "Ranking boost", included: false },
      { text: "Featured badge", included: false },
    ],
  },
  {
    id: "startup-ultra",
    name: "Ultra",
    price: 79,
    yearlyPrice: 65,
    unit: "/ month",
    badge: "Max exposure",
    cta: "Maximize exposure",
    ctaHref: "/checkout?plan=startup-ultra&interval=monthly",
    yearlyCtaHref: "/checkout?plan=startup-ultra&interval=yearly",
    color: "text-purple-700",
    borderColor: "border-purple-300",
    bgColor: "bg-purple-600",
    features: [
      { text: "Everything in Plus", included: true },
      { text: "Ranking boost (capped at +25%)", included: true, note: "Fair — not pay-to-win" },
      { text: "Featured badge on profile", included: true },
      { text: "Longevity multiplier", included: true, note: "Grows over time, capped" },
      { text: "Extended analytics", included: true, note: "Investor interest, alert frequency" },
      { text: "14-day free trial", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

// ─── Feature Row ──────────────────────────────────────────────────────────────
function FeatureRow({ feature, recommended }: { feature: PlanFeature; recommended?: boolean }) {
  return (
    <li className="flex items-start gap-2.5 py-1">
      <span className={cn(
        "mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
        feature.included ? recommended ? "bg-white/20" : "bg-gray-100" : "bg-transparent"
      )}>
        {feature.included ? (
          <Check className={cn("w-2.5 h-2.5", recommended ? "text-white" : "text-emerald-500")} />
        ) : (
          <span className={cn("w-2 h-px block", recommended ? "bg-white/30" : "bg-gray-300")} />
        )}
      </span>
      <span className={cn(
        "text-xs leading-relaxed",
        feature.included
          ? recommended ? "text-white/90" : "text-gray-700"
          : recommended ? "text-white/30 line-through" : "text-gray-300 line-through"
      )}>
        {feature.text}
        {feature.note && feature.included && (
          <span className={cn("ml-1 text-[10px]", recommended ? "text-white/50" : "text-gray-400")}>
            · {feature.note}
          </span>
        )}
      </span>
    </li>
  );
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────
function PricingCard({
  plan,
  billing,
  seats,
  seatDiscount,
  showTotal,
}: {
  plan: Plan;
  billing: BillingInterval;
  seats?: number;
  seatDiscount?: number;
  showTotal?: boolean;
}) {
  const basePrice = billing === "yearly" && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
  const discountedPrice =
    seatDiscount && seatDiscount > 0 && plan.price > 0
      ? Math.round(basePrice * (1 - seatDiscount / 100) * 100) / 100
      : basePrice;

  const href =
    billing === "yearly" && plan.yearlyCtaHref ? plan.yearlyCtaHref : plan.ctaHref;

  const isRec = plan.recommended;

  const totalMonthly =
    showTotal && seats && plan.price > 0
      ? Math.round(discountedPrice * seats * 100) / 100
      : null;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border-2 transition-all duration-300",
        isRec
          ? `${plan.bgColor} ${plan.borderColor} shadow-2xl scale-105 z-10`
          : `bg-white ${plan.borderColor} shadow-md hover:shadow-lg hover:-translate-y-0.5 z-0`
      )}
      style={{ minHeight: 560 }}
    >
      {plan.badge && (
        <div className={cn(
          "absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap",
          isRec ? "bg-white text-blue-600 shadow-md" : "bg-gray-900 text-white"
        )}>
          {plan.badge}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className={cn("text-lg font-bold", isRec ? "text-white" : "text-gray-900")}>
            {plan.name}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-5">
          {plan.price === 0 ? (
            <div className={cn("text-4xl font-black", isRec ? "text-white" : "text-gray-900")}>Free</div>
          ) : (
            <div className="flex items-end gap-1.5">
              {seatDiscount && seatDiscount > 0 ? (
                <div className="flex flex-col">
                  <span className={cn("text-xs line-through opacity-50", isRec ? "text-white" : "text-gray-400")}>
                    €{basePrice}
                  </span>
                  <span className={cn("text-4xl font-black", isRec ? "text-white" : "text-gray-900")}>
                    €{discountedPrice}
                  </span>
                </div>
              ) : (
                <span className={cn("text-4xl font-black", isRec ? "text-white" : "text-gray-900")}>
                  €{discountedPrice}
                </span>
              )}
              <span className={cn("text-sm pb-1.5", isRec ? "text-white/60" : "text-gray-400")}>
                {plan.unit}
              </span>
            </div>
          )}
          {billing === "yearly" && plan.yearlyPrice && (
            <p className={cn("text-xs mt-1", isRec ? "text-white/60" : "text-gray-400")}>
              Billed annually · save 2 months
            </p>
          )}
          {billing === "monthly" && plan.yearlyPrice && (
            <p className={cn("text-xs mt-1", isRec ? "text-white/60" : "text-gray-400")}>
              or €{plan.yearlyPrice}/mo billed yearly
            </p>
          )}
          {totalMonthly !== null && (
            <p className={cn("text-xs font-semibold mt-2", isRec ? "text-white/80" : "text-gray-600")}>
              Total: €{totalMonthly}/mo for {seats} seat{seats !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* CTA */}
        <Link
          href={href}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 mb-5",
            isRec
              ? "bg-white text-blue-700 hover:bg-blue-50 shadow-md"
              : plan.price === 0
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : `${plan.bgColor} text-white hover:opacity-90 shadow-sm`
          )}
        >
          {plan.cta}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <div className={cn("w-full h-px mb-4", isRec ? "bg-white/20" : "bg-gray-100")} />

        <ul className="space-y-0.5 flex-1">
          {plan.features.map((f, i) => (
            <FeatureRow key={i} feature={f} recommended={isRec} />
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Seat Slider ──────────────────────────────────────────────────────────────
function SeatSlider({ seats, onChange }: { seats: number; onChange: (n: number) => void }) {
  const { pct, label } = getSeatDiscount(seats);
  const hint = getNextDiscountHint(seats);

  return (
    <div className="flex flex-col gap-2 mb-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Team size</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(Math.max(1, seats - 1))}
            className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Minus className="w-2.5 h-2.5 text-gray-500" />
          </button>
          <span className="text-sm font-bold text-gray-900 w-16 text-center">
            {seats} {seats === 1 ? "seat" : "seats"}
          </span>
          <button
            onClick={() => onChange(Math.min(100, seats + 1))}
            className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Plus className="w-2.5 h-2.5 text-gray-500" />
          </button>
          {pct > 0 && (
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full ml-1">
              {label}
            </span>
          )}
        </div>
      </div>

      <input
        type="range"
        min={1}
        max={100}
        value={seats}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-blue-600 cursor-pointer"
      />

      <div className="flex justify-between text-[10px] text-gray-300">
        <span>1</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>

      {hint && (
        <p className="text-[11px] text-blue-500 text-center mt-0.5">
          💡 {hint}
        </p>
      )}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, color }: {
  icon: any; title: string; subtitle: string; color: string;
}) {
  return (
    <div className="text-center mb-10">
      <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 border", color)}>
        <Icon className="w-4 h-4" />
        {title}
      </div>
      <p className="text-gray-500 text-sm max-w-md mx-auto">{subtitle}</p>
    </div>
  );
}

// ─── Fairness Note ────────────────────────────────────────────────────────────
function FairnessNote() {
  return (
    <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 max-w-xl mx-auto mt-4">
      <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-emerald-700 leading-relaxed">
        <span className="font-semibold">Fair ranking guarantee:</span> Ultra boosts are capped at +25% and cannot force any startup to the top.
        Investor interest, profile quality, and recency always carry more weight than subscription tier.
        Core startups remain fully discoverable.
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PricingPage() {
  const [billing, setBilling] = useState<BillingInterval>("monthly");
  const [seats, setSeats] = useState(1);
  const { pct: seatDiscount } = getSeatDiscount(seats);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="text-center pt-16 pb-10 px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-3">Simple, transparent pricing</h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto mb-8">
          Two separate products: one for investors who scout, one for startups who raise.
          Free tiers exist in both.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-2xl p-1 gap-1">
          {(["monthly", "yearly"] as BillingInterval[]).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all",
                billing === b ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {b === "yearly" ? "Yearly · save ~17%" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-24 pb-24">

        {/* ── INVESTOR SECTION ───────────────────────────────────────────── */}
        <section>
          <SectionHeader
            icon={Building2}
            title="For Investors"
            subtitle="Scout EU startups, set alerts, and manage your deal flow as a team."
            color="text-blue-700 bg-blue-50 border-blue-200"
          />

          <SeatSlider seats={seats} onChange={setSeats} />

          <div className="grid grid-cols-3 gap-0 items-end px-4">
            {INVESTOR_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billing={billing}
                seats={seats}
                seatDiscount={seatDiscount}
                showTotal={true}
              />
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Seats are per organization. Admin manages who has access. Core is always single-user only.
          </p>
        </section>

        {/* ── STARTUP SECTION ────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            icon={TrendingUp}
            title="For Startups"
            subtitle="Get discovered by EU investors. From basic visibility to maximum exposure."
            color="text-purple-700 bg-purple-50 border-purple-200"
          />

          <div className="grid grid-cols-3 gap-0 items-end px-4">
            {STARTUP_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} billing={billing} />
            ))}
          </div>

          <FairnessNote />
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
          {[
            {
              icon: Building2,
              title: "Which investor plan?",
              items: [
                ["Core", "Testing the platform or occasional browsing"],
                ["Plus", "Actively scouting — the standard for most investors"],
                ["Pro", "Deal teams needing API, analytics, and audit trails"],
              ],
            },
            {
              icon: TrendingUp,
              title: "Which startup plan?",
              items: [
                ["Core", "Just want to be visible, not actively fundraising"],
                ["Plus", "Actively raising — alerts bring investors to you"],
                ["Ultra", "Want maximum exposure with a modest ranking boost"],
              ],
            },
          ].map((block) => {
            const Icon = block.icon;
            return (
              <div key={block.title} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-900">{block.title}</h3>
                </div>
                <div className="space-y-3">
                  {block.items.map(([plan, desc]) => (
                    <div key={plan} className="flex gap-3">
                      <span className="text-xs font-bold text-gray-900 w-10 flex-shrink-0 pt-0.5">{plan}</span>
                      <span className="text-xs text-gray-500 leading-relaxed">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

      </div>
    </div>
  );
}
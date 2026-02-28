"use client";

import { useState } from "react";
import { Check, ChevronRight, Shield, Building2, TrendingUp, Minus, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
  * { -webkit-font-smoothing: antialiased; }
  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .gradient-text {
    background: linear-gradient(135deg,#fff 0%,#93c5fd 50%,#fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes orb { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
  .anim-1 { animation: fadeUp 0.7s ease forwards; }
  .anim-2 { animation: fadeUp 0.7s 0.1s ease both; }
  .anim-3 { animation: fadeUp 0.7s 0.2s ease both; }
  .orb-1 { animation: orb 12s ease-in-out infinite; }
  .orb-2 { animation: orb 18s 4s ease-in-out infinite; }
  .divider { height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent); }
  .plan-card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
  .plan-card:hover { transform: translateY(-4px); }
  input[type=range] { accent-color: #3b82f6; }
`;

type BillingInterval = "monthly" | "yearly";

function getSeatDiscount(seats: number) {
  if (seats >= 25) return { pct: 15, label: "15% off" };
  if (seats >= 10) return { pct: 10, label: "10% off" };
  return { pct: 0, label: "" };
}

function getNextHint(seats: number) {
  if (seats < 10) return `Add ${10 - seats} more seat${10 - seats > 1 ? "s" : ""} to get 10% off`;
  if (seats < 25) return `Add ${25 - seats} more seat${25 - seats > 1 ? "s" : ""} to get 15% off`;
  return null;
}

const INVESTOR_PLANS = [
  {
    id: "investor-core", name: "Core", price: 0, yearlyPrice: 0, unit: "free",
    cta: "Start free", href: "/login", yearlyHref: "/login",
    recommended: false, badge: "",
    features: ["Browse all startups on map", "Basic filters (category + stage)", "View name, tagline, location", "Heart / favorite startups", "1 saved search", "Single user only"],
    locked: ["Alert creation", "Revenue & financial data", "Advanced filters", "Team seats", "CSV export"],
  },
  {
    id: "investor-plus", name: "Plus", price: 39, yearlyPrice: 32, unit: "seat / mo",
    cta: "Start scouting", href: "/checkout?plan=investor-plus&interval=monthly", yearlyHref: "/checkout?plan=investor-plus&interval=yearly",
    recommended: true, badge: "",
    features: ["Everything in Core", "Alerts for new matching startups", "Up to 10 saved searches", "Full startup profiles", "Advanced filters", "Multi-seat & org management", "Admin seat activate/deactivate", "CSV export"],
    locked: ["Unlimited saved searches", "Analytics dashboard", "API access"],
  },
  {
    id: "investor-pro", name: "Pro", price: 59, yearlyPrice: 49, unit: "seat / mo",
    cta: "Equip your team", href: "/checkout?plan=investor-pro&interval=monthly", yearlyHref: "/checkout?plan=investor-pro&interval=yearly",
    recommended: false, badge: "Deal teams",
    features: ["Everything in Plus", "Unlimited saved searches", "Priority alert delivery", "Analytics dashboard", "API access (1000 req/day)", "Bulk export", "Audit logs", "Dedicated support"],
    locked: [],
  },
];

const STARTUP_PLANS = [
  {
    id: "startup-core", name: "Core", price: 0, yearlyPrice: 0, unit: "free forever",
    cta: "Get on the map", href: "/onboarding", yearlyHref: "/onboarding",
    recommended: false, badge: "",
    features: ["Visible on map & search", "Basic profile", "Can be favorited", "Category & stage filtering", "Optional financial data"],
    locked: ["Investor alerts", "Pitch deck upload", "Profile analytics", "Ranking boost"],
  },
  {
    id: "startup-plus", name: "Plus", price: 39, yearlyPrice: 32, unit: "/ mo",
    cta: "Start raising", href: "/checkout?plan=startup-plus&interval=monthly", yearlyHref: "/checkout?plan=startup-plus&interval=yearly",
    recommended: true, badge: "",
    features: ["Everything in Core", "Included in investor alerts", "Full profile visible to investors", "Pitch deck upload", "Profile analytics", "14-day free trial"],
    locked: ["Ranking boost", "Featured badge"],
  },
  {
    id: "startup-ultra", name: "Ultra", price: 79, yearlyPrice: 65, unit: "/ mo",
    cta: "Maximize exposure", href: "/checkout?plan=startup-ultra&interval=monthly", yearlyHref: "/checkout?plan=startup-ultra&interval=yearly",
    recommended: false, badge: "Max exposure",
    features: ["Everything in Plus", "Ranking boost (capped +25%)", "Featured badge", "Longevity multiplier", "Extended analytics", "Priority support"],
    locked: [],
  },
];

function PlanCard({ plan, billing, seats, seatDiscount }: {
  plan: typeof INVESTOR_PLANS[0];
  billing: BillingInterval;
  seats?: number;
  seatDiscount?: number;
}) {
  const base = billing === "yearly" && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
  const disc = seatDiscount && seatDiscount > 0 && plan.price > 0
    ? Math.round(base * (1 - seatDiscount / 100) * 100) / 100 : base;
  const href = billing === "yearly" ? plan.yearlyHref : plan.href;
  const isRec = plan.recommended;
  const total = seats && plan.price > 0 ? Math.round(disc * seats * 100) / 100 : null;

  return (
    <div className="plan-card relative flex flex-col rounded-3xl overflow-hidden"
      style={{
        background: isRec ? 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(59,130,246,0.08))' : 'rgba(255,255,255,0.04)',
        border: isRec ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isRec ? '0 0 60px rgba(59,130,246,0.1)' : 'none',
        transform: isRec ? 'scale(1.03)' : 'scale(1)',
        zIndex: isRec ? 10 : 0,
        minHeight: 520,
      }}>

      {plan.badge && !isRec && (
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest"
          style={{background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)'}}>
          {plan.badge}
        </div>
      )}
      {isRec && (
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-medium"
          style={{background: 'rgba(59,130,246,0.3)', color: 'rgba(147,197,253,0.9)', border: '1px solid rgba(59,130,246,0.4)'}}>
          Most popular
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-widest mb-5"
          style={{color: isRec ? 'rgba(147,197,253,0.7)' : 'rgba(255,255,255,0.3)'}}>
          {plan.name}
        </p>

        <div className="mb-6">
          {plan.price === 0 ? (
            <div className="text-white/90 mb-1" style={{fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem'}}>Free</div>
          ) : (
            <>
              <div className="flex items-end gap-1.5">
                {seatDiscount && seatDiscount > 0 && (
                  <span className="text-sm line-through mb-2" style={{color: 'rgba(255,255,255,0.25)'}}>€{base}</span>
                )}
                <span className="text-white/90" style={{fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', lineHeight: 1}}>€{disc}</span>
                <span className="text-xs mb-1.5" style={{color: 'rgba(255,255,255,0.3)'}}>{plan.unit}</span>
              </div>
              {billing === "yearly" && plan.yearlyPrice > 0 && (
                <p className="text-xs mt-1" style={{color: 'rgba(255,255,255,0.3)'}}>Billed annually · save 2 months</p>
              )}
              {billing === "monthly" && plan.yearlyPrice > 0 && (
                <p className="text-xs mt-1" style={{color: 'rgba(255,255,255,0.3)'}}>or €{plan.yearlyPrice}/mo billed yearly</p>
              )}
              {total !== null && seats && (
                <p className="text-xs font-medium mt-2" style={{color: isRec ? 'rgba(147,197,253,0.7)' : 'rgba(255,255,255,0.4)'}}>
                  Total: €{total}/mo · {seats} seat{seats !== 1 ? "s" : ""}
                </p>
              )}
            </>
          )}
        </div>

        <Link href={href}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-medium mb-6 transition-all"
          style={isRec
            ? {background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: 'white', boxShadow: '0 8px 32px rgba(59,130,246,0.35)'}
            : plan.price === 0
              ? {background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)'}
              : {background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)'}
          }>
          {plan.cta} <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <div className="mb-5" style={{height: 1, background: 'rgba(255,255,255,0.06)'}} />

        <ul className="space-y-2.5 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <span className="mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{background: isRec ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}}>
                <Check className="w-2 h-2" style={{color: isRec ? 'rgba(147,197,253,0.9)' : 'rgba(255,255,255,0.5)'}} />
              </span>
              <span className="text-xs leading-relaxed" style={{color: 'rgba(255,255,255,0.55)'}}>{f}</span>
            </li>
          ))}
          {plan.locked.map((f) => (
            <li key={f} className="flex items-start gap-2.5 opacity-30">
              <span className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center">
                <span className="w-2 h-px block" style={{background: 'rgba(255,255,255,0.3)'}} />
              </span>
              <span className="text-xs line-through" style={{color: 'rgba(255,255,255,0.3)'}}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PricingPage() {
  const [billing, setBilling] = useState<BillingInterval>("monthly");
  const [seats, setSeats] = useState(1);
  const { pct, label } = getSeatDiscount(seats);
  const hint = getNextHint(seats);

  return (
    <div className="min-h-screen bg-[#060608] text-white" style={{fontFamily: "'DM Sans', sans-serif"}}>
      <style>{STYLES}</style>

      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div className="orb-1 absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)'}} />
        <div className="orb-2 absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)'}} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="glass mx-4 mt-4 rounded-2xl">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)'}}>
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/70">InvestTable</span>
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <div className="anim-1 text-center mb-14">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Pricing</p>
          <h1 className="text-white/90 leading-none mb-4"
            style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)'}}>
            Simple, transparent<br />
            <em className="gradient-text">pricing.</em>
          </h1>
          <p className="text-white/35 text-sm font-light max-w-md mx-auto">
            Two products. Free tiers in both. No surprises.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="anim-2 flex justify-center mb-14">
          <div className="glass rounded-2xl p-1 flex gap-1">
            {(["monthly", "yearly"] as BillingInterval[]).map((b) => (
              <button key={b} onClick={() => setBilling(b)}
                className="px-6 py-2.5 rounded-xl text-xs font-medium transition-all capitalize"
                style={{
                  background: billing === b ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: billing === b ? 'white' : 'rgba(255,255,255,0.35)',
                }}>
                {b === "yearly" ? "Yearly · save ~17%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* INVESTOR */}
        <section className="mb-24">
          <div className="anim-3 text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-xs font-medium"
              style={{background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(147,197,253,0.8)'}}>
              <Building2 className="w-3.5 h-3.5" /> For Investors
            </div>
            <p className="text-xs text-white/30 font-light">Scout EU startups, set alerts, manage deal flow as a team.</p>
          </div>

          {/* Seat Slider */}
          <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest" style={{color: 'rgba(255,255,255,0.3)'}}>Team size</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{background: 'rgba(255,255,255,0.07)'}}>
                  <Minus className="w-2.5 h-2.5 text-white/50" />
                </button>
                <span className="text-sm font-medium text-white w-16 text-center">
                  {seats} {seats === 1 ? "seat" : "seats"}
                </span>
                <button onClick={() => setSeats(Math.min(100, seats + 1))}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{background: 'rgba(255,255,255,0.07)'}}>
                  <Plus className="w-2.5 h-2.5 text-white/50" />
                </button>
                {pct > 0 && (
                  <span className="text-[10px] font-medium ml-1 px-2 py-0.5 rounded-full"
                    style={{background: 'rgba(16,185,129,0.15)', color: 'rgba(52,211,153,0.9)', border: '1px solid rgba(16,185,129,0.2)'}}>
                    {label}
                  </span>
                )}
              </div>
            </div>
            <input type="range" min={1} max={100} value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full h-1 rounded-full cursor-pointer" />
            <div className="flex justify-between text-[10px] mt-1.5" style={{color: 'rgba(255,255,255,0.2)'}}>
              <span>1</span><span>25</span><span>50</span><span>75</span><span>100</span>
            </div>
            {hint && (
              <p className="text-center text-[11px] mt-3" style={{color: 'rgba(96,165,250,0.7)'}}>
                💡 {hint}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 items-center px-2">
            {INVESTOR_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billing={billing} seats={seats} seatDiscount={pct} />
            ))}
          </div>
          <p className="text-center text-xs mt-6" style={{color: 'rgba(255,255,255,0.2)'}}>
            Seats are per organization. Core is always single-user only.
          </p>
        </section>

        <div className="divider mb-24" />

        {/* STARTUP */}
        <section className="mb-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-xs font-medium"
              style={{background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgba(196,181,253,0.8)'}}>
              <TrendingUp className="w-3.5 h-3.5" /> For Startups
            </div>
            <p className="text-xs text-white/30 font-light">Get discovered by EU investors. From basic visibility to maximum exposure.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 items-center px-2">
            {STARTUP_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billing={billing} />
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-2xl p-4 max-w-xl mx-auto mt-8"
            style={{background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)'}}>
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color: 'rgba(52,211,153,0.7)'}} />
            <p className="text-xs font-light leading-relaxed" style={{color: 'rgba(52,211,153,0.6)'}}>
              <span className="font-medium">Fair ranking guarantee:</span> Ultra boosts are capped at +25%.
              Investor interest and profile quality always outweigh subscription tier.
            </p>
          </div>
        </section>

        <div className="divider mb-20" />

        {/* FAQ */}
        <section className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            {
              icon: Building2, title: "Which investor plan?",
              items: [["Core","Occasional browsing or testing"],["Plus","Actively scouting — standard for most"],["Pro","Deal teams needing API and audit trails"]],
            },
            {
              icon: TrendingUp, title: "Which startup plan?",
              items: [["Core","Visible, not actively fundraising"],["Plus","Actively raising — alerts work for you"],["Ultra","Maximum exposure with ranking boost"]],
            },
          ].map((block) => {
            const Icon = block.icon;
            return (
              <div key={block.title} className="glass rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Icon className="w-4 h-4" style={{color: 'rgba(255,255,255,0.3)'}} />
                  <h3 className="text-sm font-medium" style={{color: 'rgba(255,255,255,0.6)'}}>{block.title}</h3>
                </div>
                <div className="space-y-4">
                  {block.items.map(([plan, desc]) => (
                    <div key={plan} className="flex gap-3">
                      <span className="text-xs font-medium w-10 flex-shrink-0 pt-0.5" style={{color: 'rgba(255,255,255,0.6)'}}>{plan}</span>
                      <span className="text-xs font-light leading-relaxed" style={{color: 'rgba(255,255,255,0.3)'}}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <footer className="relative z-10 py-10 px-6" style={{borderTop: '1px solid rgba(255,255,255,0.05)'}}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs" style={{color: 'rgba(255,255,255,0.2)'}}>© 2025 InvestTable · EU GDPR compliant</p>
          <Link href="/" className="text-xs transition-colors" style={{color: 'rgba(255,255,255,0.25)'}}>← Back to home</Link>
        </div>
      </footer>
    </div>
  );
}

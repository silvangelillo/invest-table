"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight, ChevronLeft, Upload, MapPin, Shield, Check,
  Globe, Users, DollarSign, Sparkles, Building2, Zap
} from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { StartupPricingTier } from "@/types";

// ── Category Taxonomy ─────────────────────────────────────────────────────────
const CATEGORY_TAXONOMY = [
  {
    id: "technology",
    label: "Technology",
    emoji: "💻",
    color: "rgba(59,130,246,0.15)",
    borderColor: "rgba(59,130,246,0.35)",
    activeColor: "rgba(59,130,246,0.25)",
    textColor: "rgba(147,197,253,0.9)",
    subcategories: ["SaaS", "AI & Machine Learning", "Cybersecurity", "Developer Tools", "Cloud Infrastructure", "AdTech", "LegalTech", "HRTech"],
  },
  {
    id: "fintech",
    label: "Finance & FinTech",
    emoji: "💳",
    color: "rgba(16,185,129,0.12)",
    borderColor: "rgba(16,185,129,0.3)",
    activeColor: "rgba(16,185,129,0.2)",
    textColor: "rgba(52,211,153,0.9)",
    subcategories: ["Payments & Banking", "InsurTech", "WealthTech", "Crypto & Web3", "RegTech", "Lending & Credit", "B2B Finance"],
  },
  {
    id: "health",
    label: "Life Sciences & Health",
    emoji: "🧬",
    color: "rgba(239,68,68,0.1)",
    borderColor: "rgba(239,68,68,0.25)",
    activeColor: "rgba(239,68,68,0.2)",
    textColor: "rgba(252,165,165,0.9)",
    subcategories: ["HealthTech", "BioTech", "MedTech", "Pharma & Drug Discovery", "Mental Health", "Digital Therapeutics", "Genomics"],
  },
  {
    id: "climate",
    label: "Climate & Energy",
    emoji: "🌱",
    color: "rgba(34,197,94,0.1)",
    borderColor: "rgba(34,197,94,0.25)",
    activeColor: "rgba(34,197,94,0.2)",
    textColor: "rgba(134,239,172,0.9)",
    subcategories: ["CleanTech", "Renewable Energy", "Carbon & Offsetting", "Circular Economy", "Sustainable Agriculture", "Green Building", "Water Tech"],
  },
  {
    id: "mobility",
    label: "Mobility & Logistics",
    emoji: "🚗",
    color: "rgba(245,158,11,0.1)",
    borderColor: "rgba(245,158,11,0.25)",
    activeColor: "rgba(245,158,11,0.2)",
    textColor: "rgba(253,211,77,0.9)",
    subcategories: ["EV & Automotive", "Urban Mobility", "Freight & Supply Chain", "Last-Mile Delivery", "Drones & Aviation", "Smart Infrastructure"],
  },
  {
    id: "food",
    label: "Food & Agriculture",
    emoji: "🌾",
    color: "rgba(168,85,247,0.1)",
    borderColor: "rgba(168,85,247,0.25)",
    activeColor: "rgba(168,85,247,0.2)",
    textColor: "rgba(216,180,254,0.9)",
    subcategories: ["FoodTech", "AgriTech", "Alternative Protein", "Restaurant Tech", "Food Delivery", "Vertical Farming", "Aquaculture"],
  },
  {
    id: "deeptech",
    label: "Deep Tech & Hardware",
    emoji: "⚛️",
    color: "rgba(6,182,212,0.1)",
    borderColor: "rgba(6,182,212,0.25)",
    activeColor: "rgba(6,182,212,0.2)",
    textColor: "rgba(103,232,249,0.9)",
    subcategories: ["Robotics", "Quantum Computing", "Semiconductors", "Space Tech", "AR / VR / XR", "Advanced Manufacturing", "Photonics", "Defense Tech"],
  },
  {
    id: "consumer",
    label: "Consumer & Media",
    emoji: "🎯",
    color: "rgba(251,146,60,0.1)",
    borderColor: "rgba(251,146,60,0.25)",
    activeColor: "rgba(251,146,60,0.2)",
    textColor: "rgba(253,186,116,0.9)",
    subcategories: ["E-Commerce", "Creator Economy", "Gaming & Esports", "EdTech", "Travel & Hospitality", "Social & Community", "PropTech", "Fashion Tech"],
  },
];

const STAGES = ["Pre-seed", "Seed", "Series A", "Series B+"] as const;
const EU_COUNTRIES = [
  "Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic",
  "Denmark","Estonia","Finland","France","Germany","Greece",
  "Hungary","Ireland","Italy","Latvia","Lithuania","Luxembourg",
  "Malta","Netherlands","Poland","Portugal","Romania","Slovakia",
  "Slovenia","Spain","Sweden","Norway","Switzerland","United Kingdom",
];

type BusinessModel = "saas" | "marketplace" | "consumer" | "hardware" | "services" | "other";

interface FormData {
  // Core
  name: string; tagline: string; short_description: string;
  email: string; website_url: string;
  primary_category: string; subcategories: string[];
  founded_year: number; team_size: number;
  funding_stage: typeof STAGES[number];
  pricing_tier: StartupPricingTier;
  country: string; city: string; lat: number | null; lng: number | null;
  pitch_deck_file: File | null; pitch_deck_url: string | null;
  gdpr_compliant: boolean;
  soc2_compliant: boolean;
  additional_certifications: string;
  // Investor Intelligence
  business_model: BusinessModel;
  arr_mrr: string;
  revenue_last_12m: string;
  revenue_cagr_3y: string;
  gross_margin: string;
  ebitda_margin: string;
  mom_growth: string;
  nrr: string;
  logo_churn: string;
  ltv: string;
  cac: string;
  cac_payback: string;
  conversion_rate: string;
  burn_rate: string;
  runway_months: string;
  total_raised: string;
  next_raise: string;
  next_raise_timeline: string;
  tam: string;
  sam: string;
  prior_exits: string;
  largest_customer_pct: string;
  has_patents: boolean;
}

const DEFAULT: FormData = {
  name: "", tagline: "", short_description: "", email: "", website_url: "",
  primary_category: "", subcategories: [],
  founded_year: new Date().getFullYear() - 2,
  team_size: 5, funding_stage: "Seed", pricing_tier: "core",
  country: "", city: "", lat: null, lng: null,
  pitch_deck_file: null, pitch_deck_url: null, gdpr_compliant: false,
  soc2_compliant: false, additional_certifications: "",
  business_model: "saas",
  arr_mrr: "", revenue_last_12m: "", revenue_cagr_3y: "",
  gross_margin: "", ebitda_margin: "", mom_growth: "",
  nrr: "", logo_churn: "",
  ltv: "", cac: "", cac_payback: "", conversion_rate: "",
  burn_rate: "", runway_months: "", total_raised: "",
  next_raise: "", next_raise_timeline: "",
  tam: "", sam: "",
  prior_exits: "", largest_customer_pct: "", has_patents: false,
};

const STEPS = [
  { label: "Your Startup", icon: Sparkles },
  { label: "Category",     icon: Building2 },
  { label: "Location",     icon: MapPin },
  { label: "Pitch Deck",   icon: Upload },
  { label: "Launch",       icon: Zap },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  * { -webkit-font-smoothing: antialiased; }

  .dark-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    color: white;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, background 0.2s;
    outline: none;
  }
  .dark-input:focus {
    border-color: rgba(59,130,246,0.5);
    background: rgba(255,255,255,0.07);
  }
  .dark-input::placeholder { color: rgba(255,255,255,0.2); }
  .dark-input option { background: #1a1a2e; color: white; }

  .dark-textarea {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    color: white;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
    outline: none;
    resize: none;
    min-height: 100px;
  }
  .dark-textarea:focus { border-color: rgba(59,130,246,0.5); background: rgba(255,255,255,0.07); }
  .dark-textarea::placeholder { color: rgba(255,255,255,0.2); }

  .dark-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
    font-family: 'DM Sans', sans-serif;
  }

  .step-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 28px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .step-btn-primary {
    background: linear-gradient(135deg,#3b82f6,#2563eb);
    color: white;
    box-shadow: 0 0 0 1px rgba(147,197,253,0.2), 0 8px 32px rgba(59,130,246,0.3);
  }
  .step-btn-primary:hover {
    box-shadow: 0 0 0 1px rgba(147,197,253,0.4), 0 12px 40px rgba(59,130,246,0.45);
    transform: translateY(-1px);
  }
  .step-btn-primary:disabled {
    opacity: 0.4; cursor: not-allowed; transform: none;
  }
  .step-btn-secondary {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.5);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .step-btn-secondary:hover {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.8);
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation: fadeUp 0.4s ease forwards; }

  .cat-card {
    padding: 16px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    text-align: left;
  }
  .cat-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); }

  .subcat-btn {
    padding: 7px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.5);
  }
  .subcat-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
`;

function DarkField({ label, hint, error, children }: {
  label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="dark-label">{label}</label>
      {children}
      {hint && !error && <p style={{fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:6}}>{hint}</p>}
      {error && <p style={{fontSize:11, color:'rgba(239,68,68,0.8)', marginTop:6}}>{error}</p>}
    </div>
  );
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 mb-10">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300"
              style={{
                background: active ? 'rgba(59,130,246,0.25)' : done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                border: active ? '1px solid rgba(59,130,246,0.4)' : done ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
                fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                color: active ? 'rgba(147,197,253,0.9)' : done ? 'rgba(52,211,153,0.8)' : 'rgba(255,255,255,0.25)',
              }}>
              {done
                ? <Check style={{width:12,height:12}} />
                : <Icon style={{width:12,height:12}} />
              }
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1.5"
                style={{background: done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 style={{fontFamily:"'DM Serif Display',serif", fontSize:'1.6rem', color:'rgba(255,255,255,0.9)', marginBottom:6}}>{title}</h2>
      {subtitle && <p style={{fontSize:13, color:'rgba(255,255,255,0.35)', fontWeight:300, fontFamily:"'DM Sans',sans-serif"}}>{subtitle}</p>}
    </div>
  );
}


// ── Investor Metrics Block ────────────────────────────────────────────────
const BM_OPTIONS: { id: BusinessModel; label: string; emoji: string }[] = [
  { id: "saas",        label: "SaaS / Software",  emoji: "💻" },
  { id: "marketplace", label: "Marketplace",       emoji: "🔄" },
  { id: "consumer",    label: "Consumer / D2C",    emoji: "🛍️" },
  { id: "hardware",    label: "Hardware / IoT",    emoji: "⚙️" },
  { id: "services",    label: "Services",          emoji: "🤝" },
  { id: "other",       label: "Other",             emoji: "🏗️" },
];

function Num({ label, value, onChange, placeholder, hint, prefix, suffix }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <label className="dark-label">{label}</label>
      <div className="relative">
        {prefix && (
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"rgba(255,255,255,0.25)",pointerEvents:"none"}}>
            {prefix}
          </span>
        )}
        <input type="number" className="dark-input"
          style={{paddingLeft: prefix ? 30 : 16, paddingRight: suffix ? 38 : 16}}
          placeholder={placeholder ?? "—"}
          value={value}
          onChange={e => onChange(e.target.value)} />
        {suffix && (
          <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:12,color:"rgba(255,255,255,0.25)",pointerEvents:"none"}}>
            {suffix}
          </span>
        )}
      </div>
      {hint && <p style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:4,lineHeight:1.4}}>{hint}</p>}
    </div>
  );
}

function MetricGroup({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 space-y-3"
      style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)"}}>
      <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",color:accent,marginBottom:2}}>{title}</p>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function FilledCount({ data }: { data: FormData }) {
  const fields = [
    data.arr_mrr, data.mom_growth, data.revenue_cagr_3y, data.gross_margin,
    data.ebitda_margin, data.nrr, data.logo_churn, data.ltv, data.cac,
    data.cac_payback, data.burn_rate, data.runway_months, data.total_raised,
    data.next_raise, data.tam, data.sam,
  ];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  const color = pct >= 75 ? "rgba(52,211,153,0.8)" : pct >= 40 ? "rgba(253,211,77,0.8)" : "rgba(255,255,255,0.25)";
  return (
    <div className="text-right flex-shrink-0 ml-4">
      <p style={{fontSize:18,fontWeight:600,color,lineHeight:1}}>{pct}%</p>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:2}}>profile filled</p>
    </div>
  );
}

function InvestorMetricsBlock({ data, update }: {
  data: FormData; update: (p: Partial<FormData>) => void;
}) {
  const isSaaS = data.business_model === "saas";
  const isMarket = data.business_model === "marketplace";
  const ltvCacRatio = data.ltv && data.cac && Number(data.cac) > 0
    ? Number(data.ltv) / Number(data.cac) : null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{border:"1px solid rgba(255,255,255,0.09)"}}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{background:"rgba(255,255,255,0.03)"}}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",marginBottom:2}}>Investor Intelligence</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.25)",fontWeight:300}}>Optional · self-reported · dramatically increases investor interest</p>
          </div>
          <FilledCount data={data} />
        </div>
        <div>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Business model</p>
          <div className="flex flex-wrap gap-2">
            {BM_OPTIONS.map(opt => (
              <button key={opt.id} type="button" onClick={() => update({business_model: opt.id})}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: data.business_model === opt.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                  border: data.business_model === opt.id ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: data.business_model === opt.id ? "rgba(147,197,253,0.9)" : "rgba(255,255,255,0.4)",
                }}>
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-5 space-y-4">

        <MetricGroup title="Revenue" accent="rgba(52,211,153,0.7)">
          <Num label={isSaaS ? "ARR (€)" : "Annual Revenue (€)"}
            value={data.arr_mrr} onChange={v => update({arr_mrr: v})}
            prefix="€" placeholder="500000"
            hint={isSaaS ? "Annual Recurring Revenue" : "Revenue last 12 months"} />
          <Num label="MoM Growth (%)" value={data.mom_growth} onChange={v => update({mom_growth: v})}
            suffix="%" placeholder="8" hint="Month-over-month revenue growth" />
          <Num label="3Y CAGR (%)" value={data.revenue_cagr_3y} onChange={v => update({revenue_cagr_3y: v})}
            suffix="%" placeholder="120" hint="Compound annual growth rate" />
          <Num label="Gross Margin (%)" value={data.gross_margin} onChange={v => update({gross_margin: v})}
            suffix="%" placeholder={isSaaS ? "75" : isMarket ? "60" : "40"}
            hint={isSaaS ? "Benchmark: >70% for SaaS" : "Revenue minus COGS"} />
          <Num label="EBITDA Margin (%)" value={data.ebitda_margin} onChange={v => update({ebitda_margin: v})}
            suffix="%" placeholder="-15" hint="Negative = pre-profitability" />
          {isSaaS && (
            <Num label="Net Revenue Retention (%)" value={data.nrr} onChange={v => update({nrr: v})}
              suffix="%" placeholder="110" hint=">100% = negative churn (gold standard)" />
          )}
        </MetricGroup>

        {(isSaaS || isMarket) && (
          <MetricGroup title="Retention & Churn" accent="rgba(147,197,253,0.7)">
            <Num label="Annual Logo Churn (%)" value={data.logo_churn} onChange={v => update({logo_churn: v})}
              suffix="%" placeholder="8" hint="% customers lost per year. <5% = excellent" />
            {isSaaS && (
              <Num label="Trial → Paid Conversion (%)" value={data.conversion_rate} onChange={v => update({conversion_rate: v})}
                suffix="%" placeholder="5" hint="Benchmark: 2–5% freemium, 15–25% sales-led" />
            )}
            <Num label="Top Customer (% of ARR)" value={data.largest_customer_pct} onChange={v => update({largest_customer_pct: v})}
              suffix="%" placeholder="12" hint=">40% = concentration risk flag" />
          </MetricGroup>
        )}

        <MetricGroup title="Unit Economics" accent="rgba(253,211,77,0.7)">
          <Num label="LTV (€)" value={data.ltv} onChange={v => update({ltv: v})}
            prefix="€" placeholder="12000" hint="Customer Lifetime Value" />
          <Num label="CAC (€)" value={data.cac} onChange={v => update({cac: v})}
            prefix="€" placeholder="2400" hint="Customer Acquisition Cost" />
          <Num label="CAC Payback (months)" value={data.cac_payback} onChange={v => update({cac_payback: v})}
            suffix="mo" placeholder="12" hint="<12mo = good. <6mo = exceptional" />
          {ltvCacRatio !== null && (
            <div className="col-span-2 flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)"}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>LTV:CAC ratio</span>
              <span style={{fontSize:16,fontWeight:700,marginLeft:"auto",
                color: ltvCacRatio >= 5 ? "rgba(52,211,153,0.9)" : ltvCacRatio >= 3 ? "rgba(253,211,77,0.9)" : "rgba(251,146,60,0.9)"}}>
                {ltvCacRatio.toFixed(1)}x
              </span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>
                {ltvCacRatio >= 5 ? "🟢 Excellent" : ltvCacRatio >= 3 ? "🟡 Good" : "🔴 Below 3x benchmark"}
              </span>
            </div>
          )}
        </MetricGroup>

        <MetricGroup title="Capital & Runway" accent="rgba(196,181,254,0.7)">
          <Num label="Monthly Burn (€)" value={data.burn_rate} onChange={v => update({burn_rate: v})}
            prefix="€" placeholder="80000" hint="Net monthly cash burn" />
          <Num label="Runway (months)" value={data.runway_months} onChange={v => update({runway_months: v})}
            suffix="mo" placeholder="18" hint=">18 months = healthy for investors" />
          <Num label="Total Raised (€)" value={data.total_raised} onChange={v => update({total_raised: v})}
            prefix="€" placeholder="2000000" hint="All funding to date" />
          <Num label="Next Round Target (€)" value={data.next_raise} onChange={v => update({next_raise: v})}
            prefix="€" placeholder="5000000" hint="What you are raising next" />
          <div className="col-span-2">
            <label className="dark-label">Next raise timeline</label>
            <input className="dark-input" placeholder="e.g. Q3 2025 · actively raising"
              value={data.next_raise_timeline} onChange={e => update({next_raise_timeline: e.target.value})} />
            <p style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:4}}>Investors filter by this to find live deals</p>
          </div>
        </MetricGroup>

        <MetricGroup title="Market Opportunity" accent="rgba(103,232,249,0.7)">
          <Num label="TAM (€)" value={data.tam} onChange={v => update({tam: v})}
            prefix="€" placeholder="50000000000" hint="Total Addressable Market" />
          <Num label="SAM (€)" value={data.sam} onChange={v => update({sam: v})}
            prefix="€" placeholder="5000000000" hint="Your realistic serviceable slice" />
        </MetricGroup>

        <MetricGroup title="Trust Signals" accent="rgba(253,186,116,0.7)">
          <Num label="Founder prior exits" value={data.prior_exits} onChange={v => update({prior_exits: v})}
            placeholder="0" hint="# of successful exits across founding team" />
          <div>
            <label className="dark-label">Patents / IP</label>
            <button type="button" onClick={() => update({has_patents: !data.has_patents})}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
              style={{
                background: data.has_patents ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                border: data.has_patents ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.08)",
                color: data.has_patents ? "rgba(52,211,153,0.9)" : "rgba(255,255,255,0.35)",
              }}>
              {data.has_patents ? "✓ Has patents / pending IP" : "No patents filed"}
            </button>
          </div>
        </MetricGroup>

      </div>
    </div>
  );
}

// ── Location Step ──────────────────────────────────────────────────────────
function LocationStep({ city, country, lat, lng, onCoords, onBack, onNext }: {
  city: string; country: string;
  lat: number | null; lng: number | null;
  onCoords: (lat: number, lng: number) => void;
  onBack: () => void; onNext: () => void;
}) {
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapInitRef = useRef(false);

  // Auto-geocode on mount
  useEffect(() => {
    if (lat && lng) {
      initMap(lat, lng);
      return;
    }
    geocode();
  }, []);

  async function geocode() {
    setGeocoding(true);
    setError(null);
    try {
      const query = encodeURIComponent(`${city}, ${country}`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
        headers: { 'User-Agent': 'InvestTable/1.0' }
      });
      const data = await res.json();
      if (data.length === 0) throw new Error("Location not found");
      const { lat: la, lon: lo } = data[0];
      onCoords(parseFloat(la), parseFloat(lo));
      initMap(parseFloat(la), parseFloat(lo));
    } catch {
      setError("Could not geocode location. Please try again.");
    } finally {
      setGeocoding(false);
    }
  }

  function initMap(la: number, lo: number) {
    if (mapInitRef.current) {
      // Just update marker + view
      if (mapRef.current && markerRef.current) {
        markerRef.current.setLatLng([la, lo]);
        mapRef.current.setView([la, lo], 11);
      }
      return;
    }
    if (typeof window === 'undefined') return;
    import('leaflet').then(L => {
      if (mapInitRef.current) return;
      mapInitRef.current = true;
      const container = document.getElementById('location-map');
      if (!container) return;

      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(container, { zoomControl: true, attributionControl: false }).setView([la, lo], 11);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
      }).addTo(map);

      // Custom blue pin
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 12px rgba(59,130,246,0.6)"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      });
      const marker = L.marker([la, lo], { icon }).addTo(map);

      // Allow manual adjustment by clicking
      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        onCoords(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    });
  }

  return (
    <div className="fade-up space-y-5">
      <SectionTitle
        title="Confirm your location."
        subtitle={`${city}, ${country} · Adjust the pin if needed`}
      />

      {/* Map container */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{height: 360, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>

        {geocoding && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{background:'rgba(6,6,8,0.85)', backdropFilter:'blur(8px)'}}>
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-3" />
            <p style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Locating {city}…</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3"
            style={{background:'rgba(6,6,8,0.9)'}}>
            <p style={{fontSize:13,color:'rgba(239,68,68,0.8)'}}>{error}</p>
            <button className="step-btn step-btn-secondary" onClick={geocode} style={{padding:'8px 20px',fontSize:12}}>
              Try again
            </button>
          </div>
        )}

        <div id="location-map" style={{width:'100%',height:'100%'}} />
      </div>

      {lat != null && !geocoding && !error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl"
          style={{background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)'}}>
          <MapPin style={{width:15,height:15,color:'rgba(52,211,153,0.8)',flexShrink:0}} />
          <span style={{fontSize:13,color:'rgba(52,211,153,0.9)',fontWeight:500}}>{city}, {country}</span>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginLeft:'auto',fontFamily:'monospace'}}>
            {lat.toFixed(4)}, {lng?.toFixed(4)}
          </span>
          <button onClick={geocode} style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginLeft:8,cursor:'pointer'}}>
            Re-geocode
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button className="step-btn step-btn-secondary" onClick={onBack}>
          <ChevronLeft style={{width:16,height:16}} /> Back
        </button>
        <button className="step-btn step-btn-primary flex-1"
          onClick={onNext} disabled={!lat || geocoding}
          style={{opacity: lat && !geocoding ? 1 : 0.4}}>
          Next: Pitch Deck <ChevronRight style={{width:16,height:16}} />
        </button>
      </div>
    </div>
  );
}

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(DEFAULT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update(patch: Partial<FormData>) {
    setData((d) => ({ ...d, ...patch }));
    // Clear related errors
    const keys = Object.keys(patch);
    if (keys.some(k => errors[k])) {
      setErrors(e => { const n = {...e}; keys.forEach(k => delete n[k]); return n; });
    }
  }

  function validateStep0() {
    const e: Record<string,string> = {};
    if (data.name.length < 2) e.name = "At least 2 characters required";
    if (data.tagline.length < 10) e.tagline = "At least 10 characters required";
    if (data.short_description.length < 20) e.short_description = "At least 20 characters required";
    if (!data.email.includes("@")) e.email = "Valid email required";
    if (data.website_url && !data.website_url.startsWith("http")) e.website_url = "Include https://";
    if (!data.country) e.country = "Select a country";
    if (!data.city.trim()) e.city = "Enter your city";
    return e;
  }

  function validateStep1() {
    const e: Record<string,string> = {};
    if (!data.primary_category) e.primary_category = "Select a primary category";
    return e;
  }

  function goNext() {
    if (step === 0) {
      const errs = validateStep0();
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    if (step === 1) {
      const errs = validateStep1();
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    if (step === 2 && !data.lat) {
      toast.error("Please pin your location on the map");
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setDone(true);
    toast.success("🚀 Startup submitted for review!");
  }

  const activeCat = CATEGORY_TAXONOMY.find(c => c.id === data.primary_category);

  // ── Done ──────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="fade-up text-center py-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)'}}>
          <Check style={{width:36,height:36,color:'rgba(52,211,153,0.9)'}} />
        </div>
        <h2 style={{fontFamily:"'DM Serif Display',serif", fontSize:'2rem', color:'rgba(255,255,255,0.9)', marginBottom:8}}>
          You're on the map.
        </h2>
        <p style={{color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:300, marginBottom:4}}>
          <span style={{color:'rgba(255,255,255,0.7)', fontWeight:500}}>{data.name}</span> submitted for review.
        </p>
        <p style={{color:'rgba(255,255,255,0.3)', fontSize:13}}>
          We'll notify <span style={{color:'rgba(147,197,253,0.7)'}}>{data.email}</span> when approved.
        </p>
        {data.city && (
          <p style={{color:'rgba(255,255,255,0.2)', fontSize:12, marginTop:8}}>
            📍 {data.city}, {data.country}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif"}}>
      <style>{STYLES}</style>
      <StepBar current={step} />

      {/* ── STEP 0: Basic Info ────────────────────────────────────────── */}
      {step === 0 && (
        <div className="fade-up space-y-6">
          <SectionTitle
            title="Tell us about your startup."
            subtitle="This is what investors will see first. Make it count."
          />

          <div className="grid grid-cols-1 gap-5">
            <DarkField label="Company name *" error={errors.name}>
              <input className="dark-input" placeholder="e.g. QuantumVault"
                maxLength={100} value={data.name}
                onChange={e => update({name: e.target.value})} />
            </DarkField>

            <DarkField label="One-liner tagline *" error={errors.tagline}
              hint={`${data.tagline.length}/120 · What you do in one sentence`}>
              <input className="dark-input"
                placeholder="e.g. Post-quantum encryption for European enterprises"
                maxLength={120} value={data.tagline}
                onChange={e => update({tagline: e.target.value})} />
            </DarkField>

            <DarkField label="Short description *" error={errors.short_description}
              hint={`${data.short_description.length}/500 · Describe your product, who it's for, and why it matters`}>
              <textarea className="dark-textarea"
                placeholder="What problem do you solve? Who are your customers? What makes you different?"
                maxLength={500} value={data.short_description}
                onChange={e => update({short_description: e.target.value})} />
            </DarkField>

            <div className="grid grid-cols-2 gap-4">
              <DarkField label="Email *" error={errors.email} hint="For review notifications">
                <input type="email" className="dark-input" placeholder="founder@company.com"
                  value={data.email} onChange={e => update({email: e.target.value})} />
              </DarkField>
              <DarkField label="Website" error={errors.website_url}>
                <div className="relative">
                  <Globe style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:15,height:15,color:'rgba(255,255,255,0.2)'}} />
                  <input className="dark-input" style={{paddingLeft:38}}
                    placeholder="https://yourstartup.com"
                    value={data.website_url} onChange={e => update({website_url: e.target.value})} />
                </div>
              </DarkField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <DarkField label="Funding stage *">
                <select className="dark-input" value={data.funding_stage}
                  onChange={e => update({funding_stage: e.target.value as any})}>
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </DarkField>
              <DarkField label="Founded year">
                <input type="number" className="dark-input" min={2000} max={2025}
                  value={data.founded_year} onChange={e => update({founded_year: Number(e.target.value)})} />
              </DarkField>
              <DarkField label="Team size">
                <div className="relative">
                  <Users style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:15,height:15,color:'rgba(255,255,255,0.2)'}} />
                  <input type="number" className="dark-input" style={{paddingLeft:38}}
                    min={1} value={data.team_size} onChange={e => update({team_size: Number(e.target.value)})} />
                </div>
              </DarkField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DarkField label="Country *" error={errors.country}>
                <select className="dark-input" value={data.country}
                  onChange={e => update({country: e.target.value})}>
                  <option value="">Select country</option>
                  {EU_COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </DarkField>
              <DarkField label="City *" error={errors.city}>
                <input className="dark-input" placeholder="e.g. Berlin"
                  value={data.city} onChange={e => update({city: e.target.value})} />
              </DarkField>
            </div>

            {/* ── Investor Intelligence Block ── */}
            <InvestorMetricsBlock data={data} update={update} />

            {/* Tier */}
            <div>
              <label className="dark-label">Listing tier</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  {t:"core" as StartupPricingTier, name:"Core", price:"Free", desc:"Basic visibility on the map"},
                  {t:"plus" as StartupPricingTier, name:"Plus", price:"€39/mo", desc:"Alerts + full profile + analytics"},
                  {t:"ultra" as StartupPricingTier, name:"Ultra", price:"€79/mo", desc:"Ranking boost + featured badge"},
                ] as const).map(({t, name, price, desc}) => (
                  <button key={t} type="button" onClick={() => update({pricing_tier: t})}
                    className="p-4 rounded-2xl text-left transition-all"
                    style={{
                      background: data.pricing_tier === t ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                      border: data.pricing_tier === t ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                    <p style={{fontSize:13,fontWeight:500,color:data.pricing_tier===t?'rgba(147,197,253,0.9)':'rgba(255,255,255,0.6)',marginBottom:2}}>{name}</p>
                    <p style={{fontSize:12,color:data.pricing_tier===t?'rgba(147,197,253,0.7)':'rgba(255,255,255,0.35)',marginBottom:3,fontWeight:500}}>{price}</p>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.25)',fontWeight:300}}>{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button className="step-btn step-btn-primary" onClick={goNext}>
              Next: Category <ChevronRight style={{width:16,height:16}} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Category ─────────────────────────────────────────── */}
      {step === 1 && (
        <div className="fade-up">
          <SectionTitle
            title="What space are you in?"
            subtitle="Choose your primary category, then refine with subcategories."
          />

          {errors.primary_category && (
            <p style={{fontSize:12,color:'rgba(239,68,68,0.8)',marginBottom:16}}>
              {errors.primary_category}
            </p>
          )}

          {/* Primary Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {CATEGORY_TAXONOMY.map(cat => {
              const isSelected = data.primary_category === cat.id;
              return (
                <button key={cat.id} type="button"
                  onClick={() => update({primary_category: cat.id, subcategories: []})}
                  className="cat-card"
                  style={isSelected ? {
                    background: cat.activeColor,
                    border: `1px solid ${cat.borderColor}`,
                  } : {}}>
                  <div style={{fontSize:22,marginBottom:6}}>{cat.emoji}</div>
                  <div style={{
                    fontSize:12, fontWeight:500,
                    color: isSelected ? cat.textColor : 'rgba(255,255,255,0.6)',
                    lineHeight:1.3,
                  }}>{cat.label}</div>
                  {isSelected && (
                    <div className="mt-2">
                      <Check style={{width:12,height:12,color:cat.textColor,opacity:0.8}} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Subcategories — only shown if primary selected */}
          {activeCat && (
            <div className="fade-up rounded-2xl p-5"
              style={{background: activeCat.color, border: `1px solid ${activeCat.borderColor}`}}>
              <p className="dark-label" style={{color: activeCat.textColor, marginBottom:12}}>
                {activeCat.label} · Subcategories
                <span style={{fontWeight:300,textTransform:'none',color:'rgba(255,255,255,0.3)',marginLeft:8}}>
                  Select all that apply
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {activeCat.subcategories.map(sub => {
                  const isSelected = data.subcategories.includes(sub);
                  return (
                    <button key={sub} type="button"
                      className="subcat-btn"
                      onClick={() => {
                        const next = isSelected
                          ? data.subcategories.filter(s => s !== sub)
                          : [...data.subcategories, sub];
                        update({subcategories: next});
                      }}
                      style={isSelected ? {
                        background: activeCat.activeColor,
                        border: `1px solid ${activeCat.borderColor}`,
                        color: activeCat.textColor,
                      } : {}}>
                      {isSelected && <Check style={{width:10,height:10,display:'inline',marginRight:4}} />}
                      {sub}
                    </button>
                  );
                })}
              </div>
              {data.subcategories.length > 0 && (
                <p style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:12}}>
                  {data.subcategories.length} selected: {data.subcategories.join(", ")}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button className="step-btn step-btn-secondary" onClick={() => setStep(0)}>
              <ChevronLeft style={{width:16,height:16}} /> Back
            </button>
            <button className="step-btn step-btn-primary flex-1" onClick={goNext}>
              Next: Location <ChevronRight style={{width:16,height:16}} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Location ─────────────────────────────────────────── */}
      {step === 2 && (
        <LocationStep
          city={data.city}
          country={data.country}
          lat={data.lat}
          lng={data.lng}
          onCoords={(lat, lng) => update({lat, lng})}
          onBack={() => setStep(1)}
          onNext={goNext}
        />
      )}

      {/* ── STEP 3: Pitch Deck ───────────────────────────────────────── */}
      {step === 3 && (
        <div className="fade-up space-y-5">
          <SectionTitle
            title="Upload your pitch deck."
            subtitle="PDF only · Max 20MB · Optional but strongly recommended"
          />

          <label className="flex flex-col items-center justify-center gap-4 p-12 rounded-2xl cursor-pointer transition-all"
            style={{
              border: `2px dashed ${data.pitch_deck_file ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
              background: data.pitch_deck_file ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
            }}>
            <input type="file" accept=".pdf" className="hidden"
              onChange={e => {
                const file = e.target.files?.[0] ?? null;
                if (file) {
                  update({pitch_deck_file: file, pitch_deck_url: `/uploads/${file.name}`});
                  toast.success(`✅ ${file.name} ready`);
                }
              }} />
            {data.pitch_deck_file ? (
              <>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)'}}>
                  <Check style={{width:24,height:24,color:'rgba(52,211,153,0.9)'}} />
                </div>
                <div className="text-center">
                  <p style={{fontSize:13,fontWeight:500,color:'rgba(52,211,153,0.9)'}}>{data.pitch_deck_file.name}</p>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:4}}>
                    {(data.pitch_deck_file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
                  <Upload style={{width:22,height:22,color:'rgba(255,255,255,0.3)'}} />
                </div>
                <div className="text-center">
                  <p style={{fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.6)'}}>Drop PDF here or click to browse</p>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:4}}>You can skip this step</p>
                </div>
              </>
            )}
          </label>

          <div className="flex gap-3">
            <button className="step-btn step-btn-secondary" onClick={() => setStep(2)}>
              <ChevronLeft style={{width:16,height:16}} /> Back
            </button>
            <button className="step-btn step-btn-primary flex-1" onClick={() => setStep(4)}>
              Next: Launch <ChevronRight style={{width:16,height:16}} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: GDPR + Review ────────────────────────────────────── */}
      {step === 4 && (
        <div className="fade-up space-y-5">
          <SectionTitle
            title="Almost there."
            subtitle="Review your listing and confirm GDPR compliance."
          />

          {/* GDPR — required */}
          <div className="p-5 rounded-2xl space-y-4"
            style={{background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.15)'}}>
            <div className="flex items-start gap-3">
              <Shield style={{width:18,height:18,color:'rgba(147,197,253,0.7)',marginTop:2,flexShrink:0}} />
              <div className="flex-1">
                <div className="flex items-center gap-2" style={{marginBottom:4}}>
                  <p style={{fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.8)'}}>
                    GDPR Compliance Declaration
                  </p>
                  <span style={{fontSize:10,fontWeight:600,color:'rgba(147,197,253,0.8)',background:'rgba(59,130,246,0.2)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:4,padding:'1px 6px',letterSpacing:'0.05em'}}>
                    REQUIRED
                  </span>
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',fontWeight:300,lineHeight:1.6}}>
                  By enabling this, you confirm your startup complies with GDPR.
                  Your data will only be shared with verified investors on this platform.
                </p>
              </div>
            </div>
            <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:16}}>
              <Toggle
                checked={data.gdpr_compliant}
                onChange={v => update({gdpr_compliant: v})}
                label="I confirm GDPR compliance"
              />
            </div>
          </div>

          {/* SOC 2 — optional */}
          <div className="p-5 rounded-2xl space-y-4"
            style={{background:'rgba(168,85,247,0.05)', border:'1px solid rgba(168,85,247,0.15)'}}>
            <div className="flex items-start gap-3">
              <Shield style={{width:18,height:18,color:'rgba(216,180,254,0.7)',marginTop:2,flexShrink:0}} />
              <div className="flex-1">
                <div className="flex items-center gap-2" style={{marginBottom:4}}>
                  <p style={{fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.8)'}}>
                    SOC 2 Compliance
                  </p>
                  <span style={{fontSize:10,fontWeight:600,color:'rgba(216,180,254,0.7)',background:'rgba(168,85,247,0.15)',border:'1px solid rgba(168,85,247,0.25)',borderRadius:4,padding:'1px 6px',letterSpacing:'0.05em'}}>
                    OPTIONAL
                  </span>
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',fontWeight:300,lineHeight:1.6}}>
                  Indicate if your startup holds a SOC 2 Type I or Type II certification. This builds trust with enterprise investors.
                </p>
              </div>
            </div>
            <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:16}}>
              <Toggle
                checked={data.soc2_compliant}
                onChange={v => update({soc2_compliant: v})}
                label="We hold SOC 2 certification"
              />
            </div>
          </div>

          {/* Additional certifications — open field */}
          <div className="p-5 rounded-2xl space-y-3"
            style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)'}}>
            <div className="flex items-start gap-3">
              <Shield style={{width:18,height:18,color:'rgba(255,255,255,0.25)',marginTop:2,flexShrink:0}} />
              <div className="flex-1">
                <p style={{fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.8)',marginBottom:4}}>
                  Additional Certifications
                </p>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',fontWeight:300,lineHeight:1.6}}>
                  List any other certifications, standards, or compliance frameworks your startup holds (e.g. ISO 27001, HIPAA, PCI-DSS, CE Mark).
                </p>
              </div>
            </div>
            <textarea
              className="dark-textarea"
              placeholder="e.g. ISO 27001, HIPAA, PCI-DSS, CE Mark, FedRAMP…"
              maxLength={400}
              rows={3}
              value={data.additional_certifications}
              onChange={e => update({additional_certifications: e.target.value})}
              style={{marginTop:4}}
            />
            <p style={{fontSize:11,color:'rgba(255,255,255,0.2)',textAlign:'right'}}>
              {data.additional_certifications.length}/400
            </p>
          </div>

          {/* Summary */}
          <div className="p-5 rounded-2xl"
            style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)'}}>
            <p style={{fontSize:11,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:500,marginBottom:16}}>
              Summary
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ["Company", data.name],
                ["Category", activeCat ? `${activeCat.emoji} ${activeCat.label}` : "—"],
                ["Subcategories", data.subcategories.length > 0 ? data.subcategories.slice(0,3).join(", ") + (data.subcategories.length > 3 ? "…" : "") : "None"],
                ["Location", data.city ? `${data.city}, ${data.country}` : "—"],
                ["Stage", data.funding_stage],
                ["Tier", data.pricing_tier],
                ["Email", data.email],
                ["Pitch Deck", data.pitch_deck_file?.name ?? "Not uploaded"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{fontSize:10,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>{k}</p>
                  <p style={{fontSize:12,color:'rgba(255,255,255,0.65)',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="step-btn step-btn-secondary" onClick={() => setStep(3)}>
              <ChevronLeft style={{width:16,height:16}} /> Back
            </button>
            <button className="step-btn step-btn-primary flex-1"
              onClick={handleSubmit}
              disabled={!data.gdpr_compliant || submitting}
              style={{opacity: data.gdpr_compliant && !submitting ? 1 : 0.4}}>
              {submitting ? "Submitting…" : "🚀 Launch on InvestTable"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

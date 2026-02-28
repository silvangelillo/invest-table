"use client";

import { useState } from "react";
import {
  ChevronRight, ChevronLeft, Upload, MapPin, Shield, Check,
  Globe, Users, DollarSign, Sparkles, Building2, Zap
} from "lucide-react";
import { InvestMap } from "@/components/map/InvestMap";
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

interface FormData {
  name: string; tagline: string; short_description: string;
  email: string; website_url: string;
  primary_category: string; subcategories: string[];
  founded_year: number; team_size: number;
  funding_stage: typeof STAGES[number];
  pricing_tier: StartupPricingTier;
  revenue_last_12m: string; revenue_cagr_3y: string;
  country: string; city: string; lat: number | null; lng: number | null;
  pitch_deck_file: File | null; pitch_deck_url: string | null;
  gdpr_compliant: boolean;
}

const DEFAULT: FormData = {
  name: "", tagline: "", short_description: "", email: "", website_url: "",
  primary_category: "", subcategories: [],
  founded_year: new Date().getFullYear() - 2,
  team_size: 5, funding_stage: "Seed", pricing_tier: "core",
  revenue_last_12m: "", revenue_cagr_3y: "",
  country: "", city: "", lat: null, lng: null,
  pitch_deck_file: null, pitch_deck_url: null, gdpr_compliant: false,
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

            {/* Financials */}
            <div className="rounded-2xl p-5 space-y-4"
              style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)'}}>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:500}}>
                Financials <span style={{fontWeight:300,textTransform:'none',color:'rgba(255,255,255,0.2)'}}>· optional · self-reported · increases visibility</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <DarkField label="Revenue last 12m (€)" error={errors.revenue_last_12m}>
                  <div className="relative">
                    <DollarSign style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:15,height:15,color:'rgba(255,255,255,0.2)'}} />
                    <input type="number" className="dark-input" style={{paddingLeft:38}}
                      min={0} placeholder="0" value={data.revenue_last_12m}
                      onChange={e => update({revenue_last_12m: e.target.value})} />
                  </div>
                </DarkField>
                <DarkField label="3Y Revenue CAGR (%)" error={errors.revenue_cagr_3y} hint="-100% to 300%">
                  <input type="number" className="dark-input"
                    min={-100} max={300} placeholder="e.g. 120"
                    value={data.revenue_cagr_3y} onChange={e => update({revenue_cagr_3y: e.target.value})} />
                </DarkField>
              </div>
            </div>

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
        <div className="fade-up space-y-5">
          <SectionTitle
            title="Pin your location."
            subtitle={`Click anywhere on the map to place your pin.${data.city ? ` · ${data.city}, ${data.country}` : ''}`}
          />

          <div className="rounded-2xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.08)'}}>
            <InvestMap
              locationPickMode
              onLocationPick={(lat, lng) => {
                update({lat, lng});
                toast.success(`📍 Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
              }}
              pickedLat={data.lat ?? undefined}
              pickedLng={data.lng ?? undefined}
              height="400px"
              startups={[]}
            />
          </div>

          {data.lat != null ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl"
              style={{background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)'}}>
              <MapPin style={{width:16,height:16,color:'rgba(52,211,153,0.8)',flexShrink:0}} />
              <span style={{fontSize:13,color:'rgba(52,211,153,0.9)',fontWeight:500}}>{data.city}, {data.country}</span>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginLeft:'auto',fontFamily:'monospace'}}>
                {data.lat.toFixed(4)}, {data.lng?.toFixed(4)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-2xl"
              style={{background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)'}}>
              <MapPin style={{width:16,height:16,color:'rgba(253,211,77,0.7)',flexShrink:0}} />
              <span style={{fontSize:13,color:'rgba(253,211,77,0.7)'}}>Click the map to place your pin</span>
            </div>
          )}

          <div className="flex gap-3">
            <button className="step-btn step-btn-secondary" onClick={() => setStep(1)}>
              <ChevronLeft style={{width:16,height:16}} /> Back
            </button>
            <button className="step-btn step-btn-primary flex-1"
              onClick={goNext} disabled={!data.lat} style={{opacity: data.lat ? 1 : 0.4}}>
              Next: Pitch Deck <ChevronRight style={{width:16,height:16}} />
            </button>
          </div>
        </div>
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

          {/* GDPR */}
          <div className="p-5 rounded-2xl space-y-4"
            style={{background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.15)'}}>
            <div className="flex items-start gap-3">
              <Shield style={{width:18,height:18,color:'rgba(147,197,253,0.7)',marginTop:2,flexShrink:0}} />
              <div>
                <p style={{fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.8)',marginBottom:4}}>
                  GDPR Compliance Declaration
                </p>
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

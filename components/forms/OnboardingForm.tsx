"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Upload, MapPin, Shield, Info, Check, Globe, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { InvestMap } from "@/components/map/InvestMap";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { StartupCategory, StartupSecondaryCategory, StartupPricingTier } from "@/types";

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES: StartupCategory[] = ["Tech", "Food", "Service", "Sustainability"];
const SECONDARY_CATS: StartupSecondaryCategory[] = [
  "SaaS", "DeepTech", "AI", "VR", "AR",
  "ClimateTech", "FinTech", "HealthTech", "Robotics",
  "Marketplace", "B2B", "B2C", "Hardware", "Biotech",
];
const STAGES = ["Pre-seed", "Seed", "Series A", "Series B+"] as const;
const EU_COUNTRIES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden", "Norway", "Switzerland", "United Kingdom",
];

// ── Form data type ────────────────────────────────────────────────────────────
interface FormData {
  // Step 1
  name: string;
  tagline: string;
  short_description: string;
  email: string;
  website_url: string;
  category: StartupCategory;
  secondary_categories: StartupSecondaryCategory[];
  founded_year: number;
  team_size: number;
  funding_stage: typeof STAGES[number];
  pricing_tier: StartupPricingTier;
  revenue_last_12m: string;
  revenue_cagr_3y: string;
  // Step 2
  country: string;
  city: string;
  lat: number | null;
  lng: number | null;
  // Step 3
  pitch_deck_file: File | null;
  pitch_deck_url: string | null;
  // Step 4
  gdpr_compliant: boolean;
}

const DEFAULT: FormData = {
  name: "", tagline: "", short_description: "", email: "", website_url: "",
  category: "Tech", secondary_categories: [], founded_year: 2022,
  team_size: 5, funding_stage: "Seed", pricing_tier: "core",
  revenue_last_12m: "", revenue_cagr_3y: "",
  country: "", city: "", lat: null, lng: null,
  pitch_deck_file: null, pitch_deck_url: null,
  gdpr_compliant: false,
};

// ── Step config ───────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Info",     icon: Info    },
  { label: "Location", icon: MapPin  },
  { label: "Deck",     icon: Upload  },
  { label: "GDPR",     icon: Shield  },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-2.5 text-sm rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder:text-gray-300";
const labelCls = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

function Field({ label, error, hint, required, children }: {
  label: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {STEPS.map((step, i) => {
        const Icon  = step.icon;
        const done  = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex items-center flex-1">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap",
              active ? "bg-blue-600 text-white shadow-sm"
                     : done ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-400"
            )}>
              {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              {step.label}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px mx-2", done ? "bg-emerald-300" : "bg-gray-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Validation helpers ────────────────────────────────────────────────────────
function validateStep1(d: FormData): Record<string, string> {
  const e: Record<string, string> = {};
  if (d.name.length < 2)           e.name = "Company name must be at least 2 characters";
  if (d.tagline.length < 10)       e.tagline = "Tagline must be at least 10 characters";
  if (d.short_description.length < 20) e.short_description = "Description must be at least 20 characters";
  if (!d.email.includes("@"))      e.email = "Please enter a valid email address";
  if (d.website_url && !d.website_url.startsWith("http")) e.website_url = "Please enter a valid URL (include https://)";
  if (!d.country)                  e.country = "Please select a country";
  if (!d.city.trim())              e.city = "Please enter the city";
  if (d.revenue_last_12m && Number(d.revenue_last_12m) < 0) e.revenue_last_12m = "Revenue cannot be negative";
  if (d.revenue_cagr_3y) {
    const v = Number(d.revenue_cagr_3y);
    if (v < -100 || v > 300) e.revenue_cagr_3y = "CAGR must be between -100% and 300%";
  }
  return e;
}

// ── Main Form ─────────────────────────────────────────────────────────────────
export function OnboardingForm() {
  const [step, setStep]         = useState(0);
  const [data, setData]         = useState<FormData>(DEFAULT);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);

  function update(patch: Partial<FormData>) {
    setData((d) => ({ ...d, ...patch }));
  }

  function handleLocationPick(lat: number, lng: number) {
    update({ lat, lng });
    toast.success(`📍 Location pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  }

  function goNext() {
    if (step === 0) {
      const errs = validateStep1(data);
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
      setErrors({});
    }
    if (step === 1 && !data.lat) {
      toast.error("Please click the map to set your location");
      return;
    }
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setDone(true);
    toast.success("🚀 Startup registered! We'll review and notify you by email.");
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <Card className="max-w-lg mx-auto text-center p-10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">You're on the map!</h2>
        <p className="text-gray-500 text-sm mb-1">
          <span className="font-semibold text-gray-700">{data.name}</span> has been submitted for review.
        </p>
        <p className="text-xs text-gray-400">We'll notify <span className="font-medium">{data.email}</span> when approved.</p>
        {data.city && <p className="text-xs text-gray-400 mt-2">📍 {data.city}, {data.country}</p>}
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepBar current={step} />

      {/* ── STEP 0: Basic Info ────────────────────────────────────────────── */}
      {step === 0 && (
        <Card>
          <CardBody className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tell us about your startup</h2>
              <p className="text-sm text-gray-500 mt-1">Basic information investors will see</p>
            </div>

            {/* Name */}
            <Field label="Company Name" required error={errors.name} hint={`${data.name.length}/100`}>
              <input
                className={inputCls}
                placeholder="e.g. QuantumVault"
                maxLength={100}
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </Field>

            {/* Tagline */}
            <Field label="Tagline" required error={errors.tagline} hint="One-liner that explains what you do">
              <input
                className={inputCls}
                placeholder="e.g. Post-quantum encryption for enterprises"
                maxLength={120}
                value={data.tagline}
                onChange={(e) => update({ tagline: e.target.value })}
              />
            </Field>

            {/* Short Description */}
            <Field
              label="Short Description"
              required
              error={errors.short_description}
              hint={`${data.short_description.length}/500 (min 20) · Describe the company's main product or service`}
            >
              <textarea
                className={cn(inputCls, "resize-none h-24")}
                placeholder="Describe the company's main product or service..."
                maxLength={500}
                value={data.short_description}
                onChange={(e) => update({ short_description: e.target.value })}
              />
            </Field>

            {/* Website + Email */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Website URL" error={errors.website_url} hint="Please enter a valid URL">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    className={cn(inputCls, "pl-9")}
                    placeholder="https://yourstartup.com"
                    value={data.website_url}
                    onChange={(e) => update({ website_url: e.target.value })}
                  />
                </div>
              </Field>
              <Field label="Your Email" required error={errors.email} hint="We'll notify you when approved">
                <input
                  type="email"
                  className={inputCls}
                  placeholder="you@company.com"
                  value={data.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </Field>
            </div>

            {/* Category */}
            <Field label="Primary Category" required>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => update({ category: cat })}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      data.category === cat
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Field>

            {/* Secondary Categories */}
            <Field label="Secondary Categories" hint="Select up to 5">
              <div className="flex flex-wrap gap-1.5">
                {SECONDARY_CATS.map((cat) => {
                  const sel = data.secondary_categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        const next = sel
                          ? data.secondary_categories.filter((c) => c !== cat)
                          : data.secondary_categories.length < 5
                            ? [...data.secondary_categories, cat]
                            : data.secondary_categories;
                        update({ secondary_categories: next });
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                        sel ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                      )}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Stage + Founded + Team */}
            <div className="grid grid-cols-3 gap-4">
              <Field label="Funding Stage" required>
                <select className={inputCls} value={data.funding_stage} onChange={(e) => update({ funding_stage: e.target.value as any })}>
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Founded Year">
                <input
                  type="number" className={inputCls} min={2000} max={2025}
                  value={data.founded_year}
                  onChange={(e) => update({ founded_year: Number(e.target.value) })}
                />
              </Field>
              <Field label="Team Size">
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="number" className={cn(inputCls, "pl-9")} min={1}
                    value={data.team_size}
                    onChange={(e) => update({ team_size: Number(e.target.value) })}
                  />
                </div>
              </Field>
            </div>

            {/* HQ Country + City */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="HQ Country" required error={errors.country}>
                <select className={inputCls} value={data.country} onChange={(e) => update({ country: e.target.value })}>
                  <option value="">Select country</option>
                  {EU_COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="HQ City" required error={errors.city}>
                <input
                  className={inputCls}
                  placeholder="e.g. Berlin"
                  value={data.city}
                  onChange={(e) => update({ city: e.target.value })}
                />
              </Field>
            </div>

            {/* Revenue (optional) */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Financials <span className="font-normal text-gray-400 normal-case">(optional · self-reported)</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Revenue last 12m (€)" error={errors.revenue_last_12m}>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      type="number" className={cn(inputCls, "pl-9")} min={0} placeholder="0"
                      value={data.revenue_last_12m}
                      onChange={(e) => update({ revenue_last_12m: e.target.value })}
                    />
                  </div>
                </Field>
                <Field label="3Y Revenue CAGR (%)" error={errors.revenue_cagr_3y} hint="-100% to 300%">
                  <input
                    type="number" className={inputCls} min={-100} max={300} placeholder="e.g. 120"
                    value={data.revenue_cagr_3y}
                    onChange={(e) => update({ revenue_cagr_3y: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            {/* Tier selection */}
            <div className="space-y-2">
              <p className={labelCls}>Listing Tier</p>
              <div className="grid grid-cols-3 gap-3">
                {(["core", "plus", "ultra"] as StartupPricingTier[]).map((tier) => {
                  const labels = { core: "Core · Free", plus: "Plus · €39/mo", ultra: "Ultra · €79/mo" };
                  const descs  = { core: "Basic visibility", plus: "Alerts + filters", ultra: "Boost + badge" };
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => update({ pricing_tier: tier })}
                      className={cn(
                        "p-3 rounded-2xl border-2 text-left transition-all",
                        data.pricing_tier === tier
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <p className="text-xs font-bold text-gray-900">{labels[tier]}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{descs[tier]}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={goNext} className="w-full gap-2" size="lg">
              Next: Location <ChevronRight className="w-4 h-4" />
            </Button>
          </CardBody>
        </Card>
      )}

      {/* ── STEP 1: Location ──────────────────────────────────────────────── */}
      {step === 1 && (
        <Card>
          <CardBody className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pin your exact location</h2>
              <p className="text-sm text-gray-500 mt-1">
                Click anywhere on the map to drop a pin · {data.city && `${data.city}, ${data.country}`}
              </p>
            </div>

            <InvestMap
              locationPickMode
              onLocationPick={handleLocationPick}
              pickedLat={data.lat ?? undefined}
              pickedLng={data.lng ?? undefined}
              height="400px"
              startups={[]}
            />

            {data.lat != null ? (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-blue-800 font-medium">{data.city}, {data.country}</span>
                <span className="text-xs text-blue-400 ml-auto font-mono">
                  {data.lat.toFixed(4)}, {data.lng?.toFixed(4)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm text-amber-700">Click the map to place your pin</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={() => setStep(0)} className="gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button size="lg" className="flex-1 gap-2" onClick={goNext} disabled={!data.lat}>
                Next: Pitch Deck <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── STEP 2: Pitch Deck ────────────────────────────────────────────── */}
      {step === 2 && (
        <Card>
          <CardBody className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Upload your pitch deck</h2>
              <p className="text-sm text-gray-500 mt-1">PDF only · Max 20MB · Optional but recommended</p>
            </div>

            <label className={cn(
              "flex flex-col items-center justify-center gap-3 p-10 rounded-3xl border-2 border-dashed cursor-pointer transition-all",
              data.pitch_deck_file ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
            )}>
              <input
                type="file" accept=".pdf" className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (file) {
                    update({ pitch_deck_file: file, pitch_deck_url: `/uploads/${file.name}` });
                    toast.success(`✅ ${file.name} ready`);
                  }
                }}
              />
              {data.pitch_deck_file ? (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-emerald-800">{data.pitch_deck_file.name}</p>
                    <p className="text-xs text-emerald-600 mt-1">{(data.pitch_deck_file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Drop PDF here or click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">You can skip this step</p>
                  </div>
                </>
              )}
            </label>

            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button size="lg" className="flex-1 gap-2" onClick={() => setStep(3)}>
                Next: GDPR <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── STEP 3: GDPR + Summary ────────────────────────────────────────── */}
      {step === 3 && (
        <Card>
          <CardBody className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">GDPR & Final Review</h2>
              <p className="text-sm text-gray-500 mt-1">Confirm compliance before submitting</p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">GDPR Compliance Declaration</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    By enabling this, you confirm your startup complies with GDPR. Your data will only
                    be shared with verified investors on this platform.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <Toggle
                  checked={data.gdpr_compliant}
                  onChange={(v) => update({ gdpr_compliant: v })}
                  label="I confirm GDPR compliance"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Registration Summary</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                {[
                  ["Company",   data.name],
                  ["Category",  data.category],
                  ["Location",  data.city ? `${data.city}, ${data.country}` : "—"],
                  ["Stage",     data.funding_stage],
                  ["Tier",      data.pricing_tier],
                  ["Email",     data.email],
                  ["Pitch Deck", data.pitch_deck_file?.name ?? "Not uploaded"],
                  ["Website",    data.website_url || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <span className="text-blue-400">{k}</span>
                    <span className="font-medium text-blue-800 truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={() => setStep(2)} className="gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2"
                loading={submitting}
                disabled={!data.gdpr_compliant}
                onClick={handleSubmit}
              >
                🚀 Submit Startup
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

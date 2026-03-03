"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { SearchFilters, StartupCategory, StartupSecondaryCategory, StartupPricingTier } from "@/types";
import { CATEGORY_CONFIG } from "@/lib/utils";

// ─── Design tokens (matches dashboard) ───────────────────────────────────────
const TEXT1   = "rgba(255,255,255,0.85)";
const TEXT2   = "rgba(255,255,255,0.45)";
const TEXT3   = "rgba(255,255,255,0.22)";
const BORDER  = "rgba(255,255,255,0.08)";
const BLUE    = "#3b82f6";

const PRIMARY_CATS = Object.keys(CATEGORY_CONFIG) as StartupCategory[];

const SECONDARY_BY_CAT: Record<StartupCategory, StartupSecondaryCategory[]> = {
  "Technology":             ["SaaS", "AI & Machine Learning", "Cybersecurity", "Developer Tools", "Cloud Infrastructure", "AdTech", "LegalTech", "HRTech"],
  "Finance & FinTech":      ["Payments & Banking", "InsurTech", "WealthTech", "Crypto & Web3", "RegTech", "Lending & Credit", "B2B Finance"],
  "Life Sciences & Health": ["HealthTech", "BioTech", "MedTech", "Pharma & Drug Discovery", "Mental Health", "Digital Therapeutics", "Genomics"],
  "Climate & Energy":       ["CleanTech", "Renewable Energy", "Carbon & Offsetting", "Circular Economy", "Sustainable Agriculture", "Green Building", "Water Tech"],
  "Mobility & Logistics":   ["EV & Automotive", "Urban Mobility", "Freight & Supply Chain", "Last-Mile Delivery", "Drones & Aviation", "Smart Infrastructure"],
  "Food & Agriculture":     ["FoodTech", "AgriTech", "Alternative Protein", "Restaurant Tech", "Food Delivery", "Vertical Farming", "Aquaculture"],
  "Deep Tech & Hardware":   ["Robotics", "Quantum Computing", "Semiconductors", "Space Tech", "AR / VR / XR", "Advanced Manufacturing", "Photonics", "Defense Tech"],
  "Consumer & Media":       ["E-Commerce", "Creator Economy", "Gaming & Esports", "EdTech", "Travel & Hospitality", "Social & Community", "PropTech", "Fashion Tech"],
};

const STAGES = ["Pre-seed", "Seed", "Series A", "Series B+"];
const TIERS: StartupPricingTier[] = ["core", "plus", "ultra"];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "7px 10px", borderRadius: 10,
  background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`,
  color: TEXT1, fontSize: 12, outline: "none", fontFamily: "inherit",
};

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  resultCount: number;
}

function SectionHeader({ label, expanded, onToggle }: { label: string; expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 0", background: "none", border: "none", cursor: "pointer",
        fontSize: 10, fontWeight: 600, color: TEXT3, textTransform: "uppercase",
        letterSpacing: "0.08em", fontFamily: "inherit",
      }}
    >
      {label}
      {expanded
        ? <ChevronUp size={12} color={TEXT3} />
        : <ChevronDown size={12} color={TEXT3} />}
    </button>
  );
}

function Pill({ label, selected, onClick, dotColor }: {
  label: string; selected: boolean; onClick: () => void; dotColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500,
        border: `1px solid ${selected ? "rgba(59,130,246,0.4)" : BORDER}`,
        background: selected ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
        color: selected ? "#93c5fd" : TEXT2,
        cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s",
        whiteSpace: "nowrap",
      }}
    >
      {dotColor && (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} />
      )}
      {label}
    </button>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "6px 0" }} />;
}

export function AdvancedFilters({ filters, onChange, resultCount }: AdvancedFiltersProps) {
  const [sections, setSections] = useState({
    categories: true, secondary: false, stage: true, tier: false, financial: false, location: false, team: false,
  });

  function toggleSection(k: keyof typeof sections) {
    setSections(s => ({ ...s, [k]: !s[k] }));
  }

  function update(patch: Partial<SearchFilters>) {
    onChange({ ...filters, ...patch });
  }

  const selectedCats = filters.categories ?? [];
  const selectedSubs = (filters.secondary_categories ?? []) as StartupSecondaryCategory[];

  // All subcategory options: union of selected primary cats, or all if none selected
  const subOptions: StartupSecondaryCategory[] = selectedCats.length > 0
    ? selectedCats.flatMap(c => SECONDARY_BY_CAT[c] ?? [])
    : (Object.values(SECONDARY_BY_CAT).flat() as StartupSecondaryCategory[]);

  const activeCount = [
    filters.categories?.length,
    filters.secondary_categories?.length,
    filters.funding_stage,
    filters.pricing_tier?.length,
    filters.min_revenue != null || filters.max_revenue != null,
    filters.min_cagr != null || filters.max_cagr != null,
    filters.min_employees != null || filters.max_employees != null,
    filters.city,
    filters.country,
  ].filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: TEXT2 }}>
          Filters {activeCount > 0 && (
            <span style={{
              marginLeft: 6, fontSize: 10, fontWeight: 700,
              color: BLUE, background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: 999, padding: "1px 6px",
            }}>
              {activeCount} active
            </span>
          )}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: TEXT3 }}>{resultCount} results</span>
          {activeCount > 0 && (
            <button
              onClick={() => onChange({})}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 11, color: "#ef4444", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 3,
              }}
            >
              <X size={11} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Primary Category */}
      <SectionHeader label="Category" expanded={sections.categories} onToggle={() => toggleSection("categories")} />
      {sections.categories && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingBottom: 10 }}>
          {PRIMARY_CATS.map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <button
                key={cat}
                onClick={() => {
                  const next = selectedCats.includes(cat)
                    ? selectedCats.filter(c => c !== cat)
                    : [...selectedCats, cat];
                  update({ categories: next.length ? next : undefined });
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500,
                  border: `1px solid ${selectedCats.includes(cat) ? cfg.borderColor : BORDER}`,
                  background: selectedCats.includes(cat) ? cfg.bgColor : "rgba(255,255,255,0.04)",
                  color: selectedCats.includes(cat) ? cfg.textColor : TEXT2,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 11 }}>{cfg.emoji}</span>
                {cfg.label}
              </button>
            );
          })}
        </div>
      )}

      <Divider />

      {/* Secondary */}
      <SectionHeader label="Subcategory" expanded={sections.secondary} onToggle={() => toggleSection("secondary")} />
      {sections.secondary && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingBottom: 10 }}>
          {subOptions.map(sub => (
            <Pill
              key={sub}
              label={sub}
              selected={selectedSubs.includes(sub)}
              onClick={() => {
                const next = selectedSubs.includes(sub)
                  ? selectedSubs.filter(s => s !== sub)
                  : [...selectedSubs, sub];
                update({ secondary_categories: next.length ? next : undefined });
              }}
            />
          ))}
        </div>
      )}

      <Divider />

      {/* Funding Stage */}
      <SectionHeader label="Funding Stage" expanded={sections.stage} onToggle={() => toggleSection("stage")} />
      {sections.stage && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingBottom: 10 }}>
          {STAGES.map(s => (
            <Pill
              key={s}
              label={s}
              selected={filters.funding_stage === s}
              onClick={() => update({ funding_stage: filters.funding_stage === s ? undefined : s })}
            />
          ))}
        </div>
      )}

      <Divider />

      {/* Location */}
      <SectionHeader label="Location" expanded={sections.location} onToggle={() => toggleSection("location")} />
      {sections.location && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 10 }}>
          <input
            style={inputStyle}
            placeholder="City..."
            value={filters.city ?? ""}
            onChange={e => update({ city: e.target.value || undefined })}
            onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.4)")}
            onBlur={e => (e.target.style.borderColor = BORDER)}
          />
          <input
            style={inputStyle}
            placeholder="Country..."
            value={filters.country ?? ""}
            onChange={e => update({ country: e.target.value || undefined })}
            onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.4)")}
            onBlur={e => (e.target.style.borderColor = BORDER)}
          />
        </div>
      )}

      <Divider />

      {/* Tier */}
      <SectionHeader label="Startup Tier" expanded={sections.tier} onToggle={() => toggleSection("tier")} />
      {sections.tier && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingBottom: 10 }}>
          {TIERS.map(t => (
            <Pill
              key={t}
              label={t.charAt(0).toUpperCase() + t.slice(1)}
              selected={(filters.pricing_tier ?? []).includes(t)}
              onClick={() => {
                const cur = filters.pricing_tier ?? [];
                const next = cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t];
                update({ pricing_tier: next.length ? next : undefined });
              }}
            />
          ))}
        </div>
      )}

      <Divider />

      {/* Financials */}
      <SectionHeader label="Financials" expanded={sections.financial} onToggle={() => toggleSection("financial")} />
      {sections.financial && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 10 }}>
          <p style={{ fontSize: 10, color: TEXT3, marginBottom: 2 }}>Revenue (€/year)</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Min €"
              value={filters.min_revenue ?? ""} onChange={e => update({ min_revenue: e.target.value ? Number(e.target.value) : undefined })} />
            <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Max €"
              value={filters.max_revenue ?? ""} onChange={e => update({ max_revenue: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <p style={{ fontSize: 10, color: TEXT3, marginBottom: 2 }}>3Y CAGR (%)</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Min %"
              value={filters.min_cagr ?? ""} onChange={e => update({ min_cagr: e.target.value ? Number(e.target.value) : undefined })} />
            <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Max %"
              value={filters.max_cagr ?? ""} onChange={e => update({ max_cagr: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
        </div>
      )}

      <Divider />

      {/* Team Size */}
      <SectionHeader label="Team Size" expanded={sections.team} onToggle={() => toggleSection("team")} />
      {sections.team && (
        <div style={{ display: "flex", gap: 8, paddingBottom: 10 }}>
          <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Min"
            value={filters.min_employees ?? ""} onChange={e => update({ min_employees: e.target.value ? Number(e.target.value) : undefined })} />
          <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Max"
            value={filters.max_employees ?? ""} onChange={e => update({ max_employees: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { SearchFilters, StartupCategory, StartupSecondaryCategory, StartupPricingTier } from "@/types";

const PRIMARY_CATS: StartupCategory[]  = ["Tech", "Food", "Service", "Sustainability"];
const SECONDARY_CATS: StartupSecondaryCategory[] = [
  "SaaS", "DeepTech", "AI", "VR", "AR",
  "ClimateTech", "FinTech", "HealthTech", "Robotics",
  "Marketplace", "B2B", "B2C", "Hardware", "Biotech",
];
const STAGES = ["Pre-seed", "Seed", "Series A", "Series B+"];
const TIERS: StartupPricingTier[] = ["core", "plus", "ultra"];

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  resultCount: number;
}

function SectionHeader({ label, expanded, onToggle }: { label: string; expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
    >
      {label}
      {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
    </button>
  );
}

function MultiPill<T extends string>({
  options, selected, onChange, colorFn,
}: {
  options: T[];
  selected: T[];
  onChange: (v: T[]) => void;
  colorFn?: (o: T) => string;
}) {
  function toggle(o: T) {
    onChange(selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o]);
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => toggle(o)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150",
            selected.includes(o)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function RangeInput({
  label, min, max, valueMin, valueMax, step = 1, prefix = "",
  onMinChange, onMaxChange,
}: {
  label: string; min: number; max: number; valueMin?: number; valueMax?: number;
  step?: number; prefix?: string; onMinChange: (v?: number) => void; onMaxChange: (v?: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="number"
            placeholder={`Min ${prefix}`}
            min={min}
            max={max}
            step={step}
            value={valueMin ?? ""}
            onChange={(e) => onMinChange(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            placeholder={`Max ${prefix}`}
            min={min}
            max={max}
            step={step}
            value={valueMax ?? ""}
            onChange={(e) => onMaxChange(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>
  );
}

export function AdvancedFilters({ filters, onChange, resultCount }: AdvancedFiltersProps) {
  const [open, setOpen]    = useState(false);
  const [sections, setSections] = useState({
    categories: true, stage: true, tier: false, financial: false, team: false,
  });

  function toggleSection(k: keyof typeof sections) {
    setSections((s) => ({ ...s, [k]: !s[k] }));
  }

  function update(patch: Partial<SearchFilters>) {
    onChange({ ...filters, ...patch });
  }

  const activeCount = [
    filters.categories?.length,
    filters.secondary_categories?.length,
    filters.funding_stage,
    filters.pricing_tier?.length,
    filters.min_revenue != null || filters.max_revenue != null,
    filters.min_cagr    != null || filters.max_cagr    != null,
    filters.min_employees != null || filters.max_employees != null,
    filters.city,
    filters.country,
  ].filter(Boolean).length;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium border transition-all",
          activeCount > 0
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span className="bg-white/30 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {activeCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-glass-xl p-5 w-72 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">Filters</span>
          <span className="text-xs text-gray-400">{resultCount} results</span>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={() => onChange({})}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
          <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">

        {/* Primary Categories */}
        <div className="border-b border-gray-100 pb-3">
          <SectionHeader label="Category" expanded={sections.categories} onToggle={() => toggleSection("categories")} />
          {sections.categories && (
            <div className="space-y-2 mt-2">
              <MultiPill
                options={PRIMARY_CATS}
                selected={filters.categories ?? []}
                onChange={(v) => update({ categories: v.length ? v : undefined })}
              />
              <p className="text-[10px] text-gray-400 pt-1">Secondary</p>
              <MultiPill
                options={SECONDARY_CATS}
                selected={(filters.secondary_categories ?? []) as StartupSecondaryCategory[]}
                onChange={(v) => update({ secondary_categories: v.length ? v : undefined })}
              />
            </div>
          )}
        </div>

        {/* Location */}
        <div className="border-b border-gray-100 py-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="City..."
              value={filters.city ?? ""}
              onChange={(e) => update({ city: e.target.value || undefined })}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Country..."
              value={filters.country ?? ""}
              onChange={(e) => update({ country: e.target.value || undefined })}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Funding Stage */}
        <div className="border-b border-gray-100 py-3">
          <SectionHeader label="Funding Stage" expanded={sections.stage} onToggle={() => toggleSection("stage")} />
          {sections.stage && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => update({ funding_stage: filters.funding_stage === s ? undefined : s })}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                    filters.funding_stage === s
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Startup Tier */}
        <div className="border-b border-gray-100 py-3">
          <SectionHeader label="Startup Tier" expanded={sections.tier} onToggle={() => toggleSection("tier")} />
          {sections.tier && (
            <MultiPill
              options={TIERS}
              selected={filters.pricing_tier ?? []}
              onChange={(v) => update({ pricing_tier: v.length ? v : undefined })}
            />
          )}
        </div>

        {/* Financial Filters */}
        <div className="border-b border-gray-100 py-3">
          <SectionHeader label="Financials" expanded={sections.financial} onToggle={() => toggleSection("financial")} />
          {sections.financial && (
            <div className="space-y-3 mt-2">
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Revenue (€/year)</p>
                <RangeInput
                  label="Revenue" min={0} max={100000000} step={10000} prefix="€"
                  valueMin={filters.min_revenue} valueMax={filters.max_revenue}
                  onMinChange={(v) => update({ min_revenue: v })}
                  onMaxChange={(v) => update({ max_revenue: v })}
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-1">3Y CAGR (%)</p>
                <RangeInput
                  label="CAGR" min={-100} max={300} step={1} prefix="%"
                  valueMin={filters.min_cagr} valueMax={filters.max_cagr}
                  onMinChange={(v) => update({ min_cagr: v })}
                  onMaxChange={(v) => update({ max_cagr: v })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Team Size */}
        <div className="py-3">
          <SectionHeader label="Team Size" expanded={sections.team} onToggle={() => toggleSection("team")} />
          {sections.team && (
            <RangeInput
              label="Team" min={1} max={10000} step={1}
              valueMin={filters.min_employees} valueMax={filters.max_employees}
              onMinChange={(v) => update({ min_employees: v })}
              onMaxChange={(v) => update({ max_employees: v })}
            />
          )}
        </div>

      </div>
    </div>
  );
}

"use client";
import { CATEGORY_CONFIG } from "@/lib/utils";
import type { StartupCategory } from "@/types";

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as StartupCategory[];

interface MapFilterBarProps {
  active: StartupCategory[];
  onChange: (cats: StartupCategory[]) => void;
  counts: Record<StartupCategory, number>;
}

export function MapFilterBar({ active, onChange, counts }: MapFilterBarProps) {
  function toggle(cat: StartupCategory) {
    onChange(active.includes(cat) ? active.filter(c => c !== cat) : [...active, cat]);
  }

  function toggleAll() {
    onChange(active.length === CATEGORIES.length ? [] : [...CATEGORIES]);
  }

  const allActive = active.length === CATEGORIES.length;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={toggleAll}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
          background: allActive ? "#1e293b" : "rgba(255,255,255,0.08)",
          color: allActive ? "#fff" : "rgba(255,255,255,0.45)",
          border: `1px solid ${allActive ? "#334155" : "rgba(255,255,255,0.1)"}`,
          cursor: "pointer", transition: "all 0.12s",
        }}
      >
        All
        <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.6 }}>{total}</span>
      </button>

      {CATEGORIES.map(cat => {
        const cfg = CATEGORY_CONFIG[cat];
        const isActive = active.includes(cat);
        return (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 500,
              background: isActive ? cfg.bgColor : "rgba(255,255,255,0.04)",
              color: isActive ? cfg.textColor : "rgba(255,255,255,0.35)",
              border: `1px solid ${isActive ? cfg.borderColor : "rgba(255,255,255,0.08)"}`,
              cursor: "pointer", transition: "all 0.12s", whiteSpace: "nowrap",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: isActive ? cfg.dotColor : "#475569", flexShrink: 0, display: "inline-block" }} />
            {cfg.label}
            <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.6 }}>{counts[cat] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}

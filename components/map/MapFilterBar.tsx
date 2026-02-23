"use client";
import { cn, CATEGORY_CONFIG } from "@/lib/utils";
import type { StartupCategory } from "@/types";

const CATEGORIES: StartupCategory[] = ["Tech", "Food", "Service", "Sustainability"];

interface MapFilterBarProps {
  active: StartupCategory[];
  onChange: (cats: StartupCategory[]) => void;
  counts: Record<StartupCategory, number>;
}

export function MapFilterBar({ active, onChange, counts }: MapFilterBarProps) {
  function toggle(cat: StartupCategory) {
    if (active.includes(cat)) {
      onChange(active.filter((c) => c !== cat));
    } else {
      onChange([...active, cat]);
    }
  }

  function toggleAll() {
    if (active.length === CATEGORIES.length) {
      onChange([]);
    } else {
      onChange([...CATEGORIES]);
    }
  }

  const allActive = active.length === CATEGORIES.length;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* All toggle */}
      <button
        onClick={toggleAll}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150",
          allActive
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
        )}
      >
        All
        <span className={cn("text-[10px] font-bold", allActive ? "text-white/70" : "text-gray-400")}>
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </button>

      {CATEGORIES.map((cat) => {
        const cfg = CATEGORY_CONFIG[cat];
        const isActive = active.includes(cat);
        return (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150",
              isActive
                ? `${cfg.bg} ${cfg.color} ${cfg.border}`
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            )}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: isActive ? cfg.dot : "#d1d5db" }}
            />
            {cat}
            <span className={cn("text-[10px] font-bold", isActive ? cfg.color : "text-gray-400")}>
              {counts[cat]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

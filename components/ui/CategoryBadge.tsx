import { cn, CATEGORY_CONFIG } from "@/lib/utils";
import type { StartupCategory } from "@/types";

interface CategoryBadgeProps {
  category: StartupCategory;
  size?: "sm" | "md";
  dot?: boolean;
}

export function CategoryBadge({ category, size = "md", dot = true }: CategoryBadgeProps) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        cfg.color, cfg.bg, cfg.border,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"
      )}
    >
      {dot && (
        <span
          className="inline-block rounded-full"
          style={{ width: 6, height: 6, backgroundColor: cfg.dot }}
        />
      )}
      {category}
    </span>
  );
}

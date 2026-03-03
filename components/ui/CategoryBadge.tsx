import { CATEGORY_CONFIG } from "@/lib/utils";
import type { StartupCategory } from "@/types";

interface CategoryBadgeProps {
  category: StartupCategory;
  size?: "sm" | "md";
  dot?: boolean;
}

export function CategoryBadge({ category, size = "md", dot = true }: CategoryBadgeProps) {
  const cfg = CATEGORY_CONFIG[category];
  if (!cfg) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        borderRadius: 999,
        fontWeight: 500,
        border: `1px solid ${cfg.borderColor}`,
        color: cfg.textColor,
        background: cfg.bgColor,
        padding: size === "sm" ? "1px 7px" : "3px 10px",
        fontSize: size === "sm" ? 10 : 11,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {dot && (
        <span
          style={{
            display: "inline-block",
            borderRadius: "50%",
            width: 5,
            height: 5,
            backgroundColor: cfg.dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {cfg.label}
    </span>
  );
}

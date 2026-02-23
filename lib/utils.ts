import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StartupCategory, SearchFilters, Startup } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Category styling config
export const CATEGORY_CONFIG: Record<
  StartupCategory,
  { color: string; bg: string; border: string; dot: string; label: string }
> = {
  Tech:           { color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    dot: "#3b82f6", label: "Tech"           },
  Food:           { color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200",  dot: "#f97316", label: "Food"           },
  Service:        { color: "text-purple-600",  bg: "bg-purple-50",  border: "border-purple-200",  dot: "#a855f7", label: "Service"        },
  Sustainability: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "#10b981", label: "Sustainability" },
};

// Extended filter matching (AND logic throughout)
export function matchesFilters(startup: Startup, filters: SearchFilters): boolean {
  // Primary category
  if (filters.categories?.length && !filters.categories.includes(startup.category)) return false;

  // Secondary categories (AND: startup must have ALL requested secondary cats)
  if (filters.secondary_categories?.length) {
    const startupSec = startup.secondary_categories ?? [];
    const hasAll = filters.secondary_categories.every((c) => startupSec.includes(c as any));
    if (!hasAll) return false;
  }

  // Location
  if (filters.city && !startup.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
  if (filters.country && !startup.country.toLowerCase().includes(filters.country.toLowerCase())) return false;

  // Stage
  if (filters.funding_stage && startup.funding_stage !== filters.funding_stage) return false;

  // Team size
  if (filters.min_team_size && startup.team_size < filters.min_team_size) return false;
  if (filters.max_team_size && startup.team_size > filters.max_team_size) return false;

  // Pricing tier
  if (filters.pricing_tier?.length && !filters.pricing_tier.includes(startup.pricing_tier)) return false;

  // Revenue
  if (filters.min_revenue != null && (startup.revenue_last_12m ?? 0) < filters.min_revenue) return false;
  if (filters.max_revenue != null && (startup.revenue_last_12m ?? Infinity) > filters.max_revenue) return false;

  // CAGR
  if (filters.min_cagr != null && (startup.revenue_cagr_3y ?? -Infinity) < filters.min_cagr) return false;
  if (filters.max_cagr != null && (startup.revenue_cagr_3y ?? Infinity)  > filters.max_cagr) return false;

  // Employees
  if (filters.min_employees != null && (startup.employee_count ?? 0) < filters.min_employees) return false;
  if (filters.max_employees != null && (startup.employee_count ?? Infinity) > filters.max_employees) return false;

  return true;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-DE", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

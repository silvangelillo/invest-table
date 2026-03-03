import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StartupCategory, SearchFilters, Startup } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Category styling config — all rgba for dark-theme compatibility
export const CATEGORY_CONFIG: Record<
  StartupCategory,
  { textColor: string; bgColor: string; borderColor: string; dotColor: string; label: string; emoji: string }
> = {
  "Technology":             { textColor: "rgba(147,197,253,0.9)", bgColor: "rgba(59,130,246,0.12)",  borderColor: "rgba(59,130,246,0.25)",  dotColor: "#3b82f6", label: "Technology",             emoji: "💻" },
  "Finance & FinTech":      { textColor: "rgba(52,211,153,0.9)",  bgColor: "rgba(16,185,129,0.12)",  borderColor: "rgba(16,185,129,0.25)",  dotColor: "#10b981", label: "Finance & FinTech",      emoji: "💳" },
  "Life Sciences & Health": { textColor: "rgba(252,165,165,0.9)", bgColor: "rgba(239,68,68,0.12)",   borderColor: "rgba(239,68,68,0.25)",   dotColor: "#ef4444", label: "Life Sciences & Health", emoji: "🧬" },
  "Climate & Energy":       { textColor: "rgba(134,239,172,0.9)", bgColor: "rgba(34,197,94,0.12)",   borderColor: "rgba(34,197,94,0.25)",   dotColor: "#22c55e", label: "Climate & Energy",       emoji: "🌱" },
  "Mobility & Logistics":   { textColor: "rgba(253,211,77,0.9)",  bgColor: "rgba(245,158,11,0.12)",  borderColor: "rgba(245,158,11,0.25)",  dotColor: "#f59e0b", label: "Mobility & Logistics",   emoji: "🚗" },
  "Food & Agriculture":     { textColor: "rgba(216,180,254,0.9)", bgColor: "rgba(168,85,247,0.12)",  borderColor: "rgba(168,85,247,0.25)",  dotColor: "#a855f7", label: "Food & Agriculture",     emoji: "🌾" },
  "Deep Tech & Hardware":   { textColor: "rgba(103,232,249,0.9)", bgColor: "rgba(6,182,212,0.12)",   borderColor: "rgba(6,182,212,0.25)",   dotColor: "#06b6d4", label: "Deep Tech & Hardware",   emoji: "⚛️" },
  "Consumer & Media":       { textColor: "rgba(253,186,116,0.9)", bgColor: "rgba(251,146,60,0.12)",  borderColor: "rgba(251,146,60,0.25)",  dotColor: "#fb923c", label: "Consumer & Media",       emoji: "🎯" },
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

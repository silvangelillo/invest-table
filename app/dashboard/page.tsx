"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TrendingUp, Users, Globe, Bell, Plus, Heart, Star } from "lucide-react";
import { InvestMap } from "@/components/map/InvestMap";
import { SavedSearchPanel } from "@/components/dashboard/SavedSearchPanel";
import { AdvancedFilters } from "@/components/dashboard/AdvancedFilters";
import { HeartButton } from "@/components/ui/HeartButton";
import { TierBadge } from "@/components/ui/TierBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Button } from "@/components/ui/Button";
import { MOCK_STARTUPS } from "@/lib/mock-data";
import { rankStartups } from "@/lib/ranking/engine";
import { matchesFilters, formatCurrency, formatDate } from "@/lib/utils";;
import { cn } from "@/lib/utils";
import type { SearchFilters } from "@/types";

// Re-export matchesFilters from utils for use here
import { matchesFilters as mf } from "@/lib/utils";

const STATS = [
  { label: "Total Startups",    value: "10", icon: TrendingUp, color: "text-blue-500",   bg: "bg-blue-50"   },
  { label: "New This Month",    value: "3",  icon: Plus,       color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Countries Covered", value: "9",  icon: Globe,      color: "text-purple-500",  bg: "bg-purple-50"  },
  { label: "Active Alerts",     value: "1",  icon: Bell,       color: "text-orange-500",  bg: "bg-orange-50"  },
];

export default function DashboardPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [view, setView] = useState<"map" | "list">("map");

  const rankedStartups = useMemo(() => rankStartups(MOCK_STARTUPS), []);

  const filtered = useMemo(
    () => rankedStartups.filter((s) => mf(s, filters)),
    [rankedStartups, filters]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-100 z-40 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">InvestTable</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { href: "/dashboard",  label: "Map & Discover", icon: Globe },
              { href: "/onboarding", label: "List a Startup",  icon: Plus  },
              { href: "/checkout",   label: "Manage Plan",     icon: TrendingUp },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            {/* Seat indicator */}
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Seats</span>
                <span className="text-[10px] text-gray-400">2 / 5 active</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
            {/* Plan badge */}
            <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-blue-900">Investor Pro</span>
              </div>
              <p className="text-[10px] text-blue-600">€39/seat/month · Active</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="ml-60 flex-1 p-8 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Ranked by relevance · {filtered.length} startups</p>
            </div>
            <Link href="/onboarding">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> List Startup
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-glass">
                  <div className={`w-8 h-8 rounded-2xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* View toggle + filters */}
          <div className="flex items-start gap-4 mb-6 flex-wrap">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 gap-1">
              {(["map", "list"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={cn("px-4 py-1.5 rounded-xl text-sm font-medium capitalize transition-all",
                    view === v ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}>
                  {v}
                </button>
              ))}
            </div>
            <AdvancedFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />
          </div>

          {/* Map view */}
          {view === "map" && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-glass p-6 mb-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">EU Startup Map</h2>
              <InvestMap startups={filtered} height="500px" />
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-glass overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Ranked Startups</h2>
                <span className="text-xs text-gray-400">Sorted by relevance score</span>
              </div>
              <div className="divide-y divide-gray-50">
                {filtered.map((startup, i) => (
                  <div key={startup.id} className="px-6 py-4 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0",
                        i === 0 ? "bg-yellow-100 text-yellow-700" :
                        i === 1 ? "bg-gray-100 text-gray-600" :
                        i === 2 ? "bg-orange-100 text-orange-700" :
                                  "bg-gray-50 text-gray-400"
                      )}>
                        {i + 1}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{startup.name}</span>
                          <CategoryBadge category={startup.category} size="sm" />
                          <TierBadge tier={startup.pricing_tier} size="sm" />
                          {startup.verified_financials && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2 truncate">{startup.tagline}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>📍 {startup.city}, {startup.country}</span>
                          <span>💰 {startup.funding_stage}</span>
                          {startup.revenue_last_12m != null && (
                            <span>
                              📊 {formatCurrency(startup.revenue_last_12m)}/yr
                              <span className="text-[10px] ml-1 text-gray-300">(self-reported)</span>
                            </span>
                          )}
                          {startup.revenue_cagr_3y != null && (
                            <span className={startup.revenue_cagr_3y >= 0 ? "text-emerald-600" : "text-red-500"}>
                              {startup.revenue_cagr_3y > 0 ? "↑" : "↓"} {Math.abs(startup.revenue_cagr_3y)}% CAGR
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right mr-2">
                          <div className="text-xs font-semibold text-gray-700">
                            {((startup.ranking_score ?? 0) * 100).toFixed(0)}
                          </div>
                          <div className="text-[10px] text-gray-400">score</div>
                        </div>
                        <HeartButton
                          startupId={startup.id}
                          heartCount={startup.heart_count ?? 0}
                          initialFavorited={false}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved searches */}
          <SavedSearchPanel />
        </main>
      </div>
    </div>
  );
}

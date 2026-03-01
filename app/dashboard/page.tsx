"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, Globe, Bell, Heart, Star, Map, List,
  LogOut, Settings, Zap, BarChart3, Bookmark,
  ArrowUpRight, Search, ChevronRight, Shield,
  Building2, Users, Plus, SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { InvestMap } from "@/components/map/InvestMap";
import { HeartButton } from "@/components/ui/HeartButton";
import { TierBadge } from "@/components/ui/TierBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { AdvancedFilters } from "@/components/dashboard/AdvancedFilters";
import { NPSSurvey } from "@/components/ui/NPSSurvey";
import { MOCK_STARTUPS } from "@/lib/mock-data";
import { rankStartups } from "@/lib/ranking/engine";
import { matchesFilters, formatCurrency } from "@/lib/utils";
import type { SearchFilters } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────
type DashView = "list" | "map" | "watchlist";
type NavSection = "discover" | "watchlist" | "alerts" | "settings";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG      = "#080808";
const CARD    = "rgba(255,255,255,0.03)";
const BORDER  = "rgba(255,255,255,0.07)";
const BORDER2 = "rgba(255,255,255,0.04)";
const TEXT1   = "rgba(255,255,255,0.90)";
const TEXT2   = "rgba(255,255,255,0.45)";
const TEXT3   = "rgba(255,255,255,0.22)";
const BLUE    = "#3b82f6";
const BLUE_BG = "rgba(59,130,246,0.12)";

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      background: BG, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", boxShadow: "0 0 32px rgba(59,130,246,0.4)",
        }}>
          <TrendingUp size={20} color="#fff" />
        </div>
        <p style={{ color: TEXT2, fontSize: 13, letterSpacing: "0.02em" }}>Loading…</p>
      </div>
    </div>
  );
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({
  label, value, sub, accent, icon: Icon,
}: {
  label: string; value: string; sub?: string;
  accent: string; icon: React.ElementType;
}) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`,
      borderRadius: 20, padding: "20px 22px",
      backdropFilter: "blur(20px)",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: `${accent}18`, border: `1px solid ${accent}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <Icon size={15} color={accent} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color: TEXT1, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: TEXT2, marginTop: 6, fontWeight: 400 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 11, color: accent, marginTop: 4, fontWeight: 500 }}>{sub}</div>
      )}
    </div>
  );
}

// ─── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, { bg: string; color: string; shadow?: string }> = {
    1: { bg: "linear-gradient(135deg,#92400e,#f59e0b)", color: "#fff", shadow: "0 2px 12px rgba(245,158,11,0.4)" },
    2: { bg: "linear-gradient(135deg,#374151,#9ca3af)", color: "#fff" },
    3: { bg: "linear-gradient(135deg,#431407,#f97316)", color: "#fff" },
  };
  const s = styles[rank] ?? { bg: "rgba(255,255,255,0.05)", color: TEXT2 };
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: s.bg, color: s.color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, flexShrink: 0,
      boxShadow: s.shadow,
    }}>
      {rank}
    </div>
  );
}

// ─── Startup row card ─────────────────────────────────────────────────────────
function StartupCard({ startup, rank, favorited, onToggleFav }: {
  startup: (typeof MOCK_STARTUPS)[0] & { ranking_score?: number };
  rank: number;
  favorited: boolean;
  onToggleFav: (id: string) => void;
}) {
  const score = ((startup.ranking_score ?? 0) * 100).toFixed(0);
  const scoreNum = parseInt(score);

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 16,
      padding: "18px 24px", borderBottom: `1px solid ${BORDER2}`,
      transition: "background 0.15s",
      cursor: "default",
    }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {/* Rank */}
      <RankBadge rank={rank} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: TEXT1 }}>{startup.name}</span>
          <CategoryBadge category={startup.category} size="sm" />
          <TierBadge tier={startup.pricing_tier} size="sm" />
          {startup.verified_financials && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: "#10b981",
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 4, padding: "1px 6px",
            }}>✓ Verified</span>
          )}
        </div>
        {/* Tagline */}
        <p style={{
          fontSize: 12, color: TEXT2, fontWeight: 300, lineHeight: 1.5,
          marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {startup.tagline}
        </p>
        {/* Metrics */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <MetaPill icon="📍" label={`${startup.city}, ${startup.country}`} />
          <MetaPill icon="💰" label={startup.funding_stage} />
          <MetaPill icon="👥" label={`${startup.team_size} people`} />
          {startup.revenue_last_12m != null && (
            <MetaPill icon="📊" label={`${formatCurrency(startup.revenue_last_12m)}/yr`} />
          )}
          {startup.revenue_cagr_3y != null && (
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: startup.revenue_cagr_3y >= 0 ? "#10b981" : "#ef4444",
            }}>
              {startup.revenue_cagr_3y >= 0 ? "↑" : "↓"}{Math.abs(startup.revenue_cagr_3y)}% CAGR
            </span>
          )}
        </div>
      </div>

      {/* Right: Score + Heart */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {/* Score ring */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 16, fontWeight: 700, lineHeight: 1,
            color: scoreNum >= 80 ? "#10b981" : scoreNum >= 60 ? BLUE : TEXT2,
          }}>
            {score}
          </div>
          <div style={{ fontSize: 9, color: TEXT3, marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>score</div>
        </div>
        {/* Fav button */}
        <button
          type="button"
          onClick={() => onToggleFav(startup.id)}
          style={{
            width: 32, height: 32, borderRadius: 10,
            background: favorited ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${favorited ? "rgba(239,68,68,0.25)" : BORDER}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          <Heart
            size={14}
            color={favorited ? "#ef4444" : TEXT2}
            fill={favorited ? "#ef4444" : "none"}
          />
        </button>
      </div>
    </div>
  );
}

function MetaPill({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ fontSize: 11, color: TEXT2, display: "flex", alignItems: "center", gap: 4 }}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  activeSection, onSection, userEmail, onLogout,
}: {
  activeSection: NavSection;
  onSection: (s: NavSection) => void;
  userEmail?: string;
  onLogout: () => void;
}) {
  const nav: { id: NavSection; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "discover",  label: "Discover",  icon: Globe },
    { id: "watchlist", label: "Watchlist", icon: Bookmark },
    { id: "alerts",    label: "Alerts",    icon: Bell, badge: 1 },
    { id: "settings",  label: "Settings",  icon: Settings },
  ];

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: 240,
      background: "rgba(255,255,255,0.015)",
      borderRight: `1px solid ${BORDER}`,
      display: "flex", flexDirection: "column",
      zIndex: 50, backdropFilter: "blur(24px)",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${BORDER2}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(59,130,246,0.35)",
          }}>
            <TrendingUp size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT1, letterSpacing: "-0.01em" }}>
              InvestTable
            </div>
            <div style={{ fontSize: 10, color: TEXT3, fontWeight: 400 }}>Investor Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(item => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button key={item.id} type="button" onClick={() => onSection(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                background: active ? BLUE_BG : "transparent",
                borderLeft: active ? `2px solid ${BLUE}` : "2px solid transparent",
                transition: "all 0.15s", textAlign: "left", width: "100%",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={15} color={active ? BLUE : TEXT2} />
              <span style={{
                fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? "#93c5fd" : TEXT2, flex: 1,
              }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#fff",
                  background: "#ef4444", borderRadius: 999,
                  minWidth: 16, height: 16, display: "flex", alignItems: "center",
                  justifyContent: "center", padding: "0 4px",
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: plan + user */}
      <div style={{ padding: "12px 10px 20px", borderTop: `1px solid ${BORDER2}`, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Seat bar */}
        <div style={{
          background: "rgba(255,255,255,0.03)", borderRadius: 12,
          border: `1px solid ${BORDER2}`, padding: "10px 12px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: TEXT3, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Seats</span>
            <span style={{ fontSize: 10, color: TEXT2 }}>2 / 5</span>
          </div>
          <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "40%", height: "100%", background: BLUE, borderRadius: 2 }} />
          </div>
        </div>

        {/* Plan badge */}
        <div style={{
          background: BLUE_BG, borderRadius: 12,
          border: "1px solid rgba(59,130,246,0.2)", padding: "10px 12px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: "#10b981" }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#93c5fd" }}>Investor Pro</div>
            <div style={{ fontSize: 10, color: TEXT2, marginTop: 1 }}>€39 / seat / month</div>
          </div>
        </div>

        {/* User + logout */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
          borderRadius: 12, border: `1px solid ${BORDER2}`,
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9,
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            {userEmail?.[0]?.toUpperCase() ?? "I"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: TEXT1, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userEmail ?? "Investor"}
            </div>
          </div>
          <button type="button" onClick={onLogout}
            title="Sign out"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 4, borderRadius: 6, display: "flex", alignItems: "center",
              color: TEXT3,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={e => (e.currentTarget.style.color = TEXT3)}
          >
            <LogOut size={13} />
          </button>
        </div>

        {/* Legal link */}
        <div style={{ paddingTop: 4 }}>
          <Link href="/terms" style={{
            display: "block", textAlign: "center",
            fontSize: 10, color: TEXT3, textDecoration: "none",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT2)}
            onMouseLeave={e => (e.currentTarget.style.color = TEXT3)}
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ─── Watchlist empty state ────────────────────────────────────────────────────
function WatchlistEmpty() {
  return (
    <div style={{
      textAlign: "center", padding: "80px 40px",
      background: CARD, borderRadius: 24, border: `1px solid ${BORDER}`,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
      }}>
        <Heart size={22} color="#ef4444" />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: TEXT1, marginBottom: 6 }}>Your watchlist is empty</p>
      <p style={{ fontSize: 13, color: TEXT2, fontWeight: 300 }}>Heart startups in Discover to save them here.</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail]     = useState<string | undefined>();
  const [section, setSection]         = useState<NavSection>("discover");
  const [view, setView]               = useState<DashView>("list");
  const [filters, setFilters]         = useState<SearchFilters>({});
  const [favorites, setFavorites]     = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Auth guard ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }
      setUserEmail(session.user.email);
      setAuthLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  // Data ───────────────────────────────────────────────────────────────────────
  const rankedStartups = useMemo(() => rankStartups(MOCK_STARTUPS), []);

  const filtered = useMemo(() => {
    let list = rankedStartups.filter(s => matchesFilters(s, filters));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rankedStartups, filters, searchQuery]);

  const watchlist = useMemo(
    () => rankedStartups.filter(s => favorites.has(s.id)),
    [rankedStartups, favorites]
  );

  const toggleFav = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  if (authLoading) return <LoadingScreen />;

  // Greeting ───────────────────────────────────────────────────────────────────
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: BG, minHeight: "100vh",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      display: "flex",
    }}>
      <Sidebar
        activeSection={section}
        onSection={(s) => {
          setSection(s);
          if (s === "watchlist") setView("list");
          if (s === "discover") setView("list");
        }}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          background: `${BG}cc`, backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: `1px solid ${BORDER2}`,
          padding: "14px 32px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          {/* Search */}
          <div style={{
            flex: 1, maxWidth: 420, position: "relative",
          }}>
            <Search size={14} color={TEXT3} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search startups, cities, stages…"
              style={{
                width: "100%", padding: "9px 14px 9px 38px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${BORDER}`,
                borderRadius: 12, fontSize: 13, color: TEXT1,
                outline: "none", fontFamily: "inherit",
                transition: "border-color 0.15s",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(59,130,246,0.4)")}
              onBlur={e => (e.target.style.borderColor = BORDER)}
            />
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Notification bell */}
          <button type="button" style={{
            width: 36, height: 36, borderRadius: 11,
            background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative",
          }}>
            <Bell size={15} color={TEXT2} />
            <span style={{
              position: "absolute", top: 7, right: 7,
              width: 6, height: 6, borderRadius: 3,
              background: "#ef4444", border: `1.5px solid ${BG}`,
            }} />
          </button>
        </header>

        {/* ── Page body ──────────────────────────────────────────────────── */}
        <div style={{ padding: "32px 32px 48px", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Greeting */}
          <div>
            <h1 style={{
              fontSize: 26, fontWeight: 700, color: TEXT1,
              letterSpacing: "-0.02em", marginBottom: 4,
            }}>
              {greeting}.
            </h1>
            <p style={{ fontSize: 13, color: TEXT2, fontWeight: 300 }}>
              {section === "discover" && `${filtered.length} startups · ${new Set(filtered.map(s => s.country)).size} countries · sorted by relevance`}
              {section === "watchlist" && `${watchlist.length} startup${watchlist.length !== 1 ? "s" : ""} in your watchlist`}
              {section === "alerts" && "Your saved searches and deal alerts"}
              {section === "settings" && "Account and subscription settings"}
            </p>
          </div>

          {/* ── Metric row (Discover only) ────────────────────────────── */}
          {section === "discover" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <MetricCard label="Total Startups"    value={String(MOCK_STARTUPS.length)} icon={TrendingUp} accent={BLUE}      sub="+3 this month" />
              <MetricCard label="Countries"         value={String(new Set(MOCK_STARTUPS.map(s => s.country)).size)} icon={Globe} accent="#a855f7" />
              <MetricCard label="Your Watchlist"    value={String(favorites.size)} icon={Bookmark} accent="#ef4444" />
              <MetricCard label="Active Alerts"     value="1" icon={Bell} accent="#f59e0b" sub="1 new match" />
            </div>
          )}

          {/* ── Discover section ─────────────────────────────────────── */}
          {section === "discover" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Toolbar */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {/* View switcher */}
                <div style={{
                  display: "flex", background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${BORDER}`, borderRadius: 12, padding: 3, gap: 2,
                }}>
                  {([
                    { v: "list" as DashView, label: "List", icon: List },
                    { v: "map"  as DashView, label: "Map",  icon: Map  },
                  ]).map(({ v, label, icon: Icon }) => (
                    <button key={v} type="button" onClick={() => setView(v)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                        background: view === v ? BLUE : "transparent",
                        color: view === v ? "#fff" : TEXT2,
                        fontSize: 12, fontWeight: view === v ? 600 : 400,
                        transition: "all 0.15s", fontFamily: "inherit",
                      }}>
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Filters toggle */}
                <button type="button" onClick={() => setShowFilters(p => !p)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 12, cursor: "pointer",
                    background: showFilters ? BLUE_BG : "rgba(255,255,255,0.04)",
                    border: `1px solid ${showFilters ? "rgba(59,130,246,0.3)" : BORDER}`,
                    color: showFilters ? "#93c5fd" : TEXT2,
                    fontSize: 12, fontWeight: showFilters ? 600 : 400,
                    fontFamily: "inherit", transition: "all 0.15s",
                  }}>
                  <SlidersHorizontal size={13} />
                  Filters
                </button>

                {/* Result count */}
                <span style={{ fontSize: 12, color: TEXT3, marginLeft: "auto" }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Filters panel */}
              {showFilters && (
                <div style={{
                  background: CARD, border: `1px solid ${BORDER}`,
                  borderRadius: 20, padding: 20,
                }}>
                  <AdvancedFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />
                </div>
              )}

              {/* Map view */}
              {view === "map" && (
                <div style={{
                  background: CARD, border: `1px solid ${BORDER}`,
                  borderRadius: 24, overflow: "hidden",
                }}>
                  <div style={{ padding: "18px 24px 0" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: TEXT1, marginBottom: 2 }}>EU Startup Map</p>
                    <p style={{ fontSize: 11, color: TEXT2 }}>{filtered.length} startups visible</p>
                  </div>
                  <div style={{ padding: 16 }}>
                    <InvestMap startups={filtered} height="520px" />
                  </div>
                </div>
              )}

              {/* List view */}
              {view === "list" && (
                <div style={{
                  background: CARD, border: `1px solid ${BORDER}`,
                  borderRadius: 24, overflow: "hidden",
                }}>
                  {/* Table header */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 24px", borderBottom: `1px solid ${BORDER2}`,
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Ranked Startups
                    </p>
                    <p style={{ fontSize: 11, color: TEXT3 }}>Sorted by relevance score</p>
                  </div>

                  {filtered.length === 0 ? (
                    <div style={{ padding: "60px 40px", textAlign: "center" }}>
                      <p style={{ fontSize: 14, color: TEXT2 }}>No startups match your filters.</p>
                      <button type="button" onClick={() => { setFilters({}); setSearchQuery(""); }}
                        style={{
                          marginTop: 12, fontSize: 12, color: BLUE, background: "none",
                          border: "none", cursor: "pointer", fontFamily: "inherit",
                        }}>
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    filtered.map((startup, i) => (
                      <StartupCard
                        key={startup.id}
                        startup={startup}
                        rank={i + 1}
                        favorited={favorites.has(startup.id)}
                        onToggleFav={toggleFav}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Watchlist section ─────────────────────────────────────── */}
          {section === "watchlist" && (
            <div>
              {watchlist.length === 0 ? (
                <WatchlistEmpty />
              ) : (
                <div style={{
                  background: CARD, border: `1px solid ${BORDER}`,
                  borderRadius: 24, overflow: "hidden",
                }}>
                  <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER2}` }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Your Watchlist · {watchlist.length}
                    </p>
                  </div>
                  {watchlist.map((startup, i) => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      rank={i + 1}
                      favorited={true}
                      onToggleFav={toggleFav}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Alerts section ────────────────────────────────────────── */}
          {section === "alerts" && (
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: 24, padding: 40, textAlign: "center",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <Bell size={22} color="#f59e0b" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: TEXT1, marginBottom: 6 }}>Deal Alerts</p>
              <p style={{ fontSize: 13, color: TEXT2, fontWeight: 300, maxWidth: 320, margin: "0 auto" }}>
                Set up saved searches and get notified when new startups matching your criteria are listed.
              </p>
              <button type="button" style={{
                marginTop: 20, padding: "10px 20px", borderRadius: 12,
                background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)",
                color: "#fbbf24", fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit",
              }}>
                Create Alert
              </button>
            </div>
          )}

          {/* ── Settings section ──────────────────────────────────────── */}
          {section === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 580 }}>
              {[
                { label: "Account", desc: userEmail ?? "—", icon: Users, accent: BLUE },
                { label: "Subscription", desc: "Investor Pro · €39/seat/month · Active", icon: Zap, accent: "#a855f7" },
                { label: "Security", desc: "Two-factor authentication enabled", icon: Shield, accent: "#10b981" },
                { label: "Organization", desc: "2 of 5 seats active", icon: Building2, accent: "#f59e0b" },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    background: CARD, border: `1px solid ${BORDER}`,
                    borderRadius: 18, padding: "18px 20px", cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 11,
                      background: `${item.accent}15`, border: `1px solid ${item.accent}25`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon size={16} color={item.accent} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: TEXT1, marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: TEXT2, fontWeight: 300 }}>{item.desc}</p>
                    </div>
                    <ChevronRight size={15} color={TEXT3} />
                  </div>
                );
              })}

              <button type="button" onClick={handleLogout}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px 20px", borderRadius: 14,
                  background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                  color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </main>

      {/* NPS survey — floats bottom-right after 45s */}
      <NPSSurvey variant="floating" />
    </div>
  );
}

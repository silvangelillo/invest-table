"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, ArrowLeft, MapPin, Users, Globe, Calendar,
  DollarSign, BarChart3, Shield, ExternalLink, Heart,
} from "lucide-react";
import { MOCK_STARTUPS } from "@/lib/mock-data";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { TierBadge } from "@/components/ui/TierBadge";
import { formatCurrency } from "@/lib/utils";

const BG     = "#080808";
const CARD   = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT1  = "rgba(255,255,255,0.90)";
const TEXT2  = "rgba(255,255,255,0.45)";
const TEXT3  = "rgba(255,255,255,0.22)";
const BLUE   = "#3b82f6";

function StatCard({ label, value, icon: Icon, accent }: {
  label: string; value: string; icon: React.ElementType; accent: string;
}) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "16px 20px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9,
        background: `${accent}18`, border: `1px solid ${accent}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={14} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: TEXT1, letterSpacing: "-0.02em" }}>{value}</div>
        <div style={{ fontSize: 11, color: TEXT2, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

export default function StartupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const startup = MOCK_STARTUPS.find(s => s.id === id);

  if (!startup) {
    return (
      <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, color: TEXT2, marginBottom: 16 }}>Startup not found.</p>
          <Link href="/dashboard" style={{ fontSize: 13, color: BLUE, textDecoration: "none" }}>← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const score = startup.ranking_score != null
    ? (startup.ranking_score * 100).toFixed(0)
    : "—";

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif", color: "white" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: `${BG}dd`, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${BORDER}`,
        padding: "14px 40px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12,
            color: TEXT3, background: "none", border: "none", cursor: "pointer",
            fontFamily: "inherit", transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = TEXT2)}
          onMouseLeave={e => (e.currentTarget.style.color = TEXT3)}
        >
          <ArrowLeft size={13} /> Back
        </button>

        <div style={{ flex: 1 }} />

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={13} color="#fff" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT3 }}>InvestTable</span>
        </Link>
      </header>

      {/* Main */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Hero row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 36, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{
            width: 64, height: 64, borderRadius: 18, flexShrink: 0,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 700, color: "#fff",
            boxShadow: "0 0 32px rgba(59,130,246,0.25)",
          }}>
            {startup.name[0]}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: TEXT1, letterSpacing: "-0.02em", margin: 0 }}>
                {startup.name}
              </h1>
              <CategoryBadge category={startup.category} size="sm" />
              <TierBadge tier={startup.pricing_tier} size="sm" />
              {startup.verified_financials && (
                <span style={{ fontSize: 10, fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 4, padding: "2px 7px" }}>
                  ✓ Verified
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, color: TEXT2, fontWeight: 300, lineHeight: 1.6, marginBottom: 12, maxWidth: 520 }}>
              {startup.tagline}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: TEXT3, display: "flex", alignItems: "center", gap: 5 }}>
                <MapPin size={12} /> {startup.city}, {startup.country}
              </span>
              <span style={{ fontSize: 12, color: TEXT3, display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={12} /> Founded {startup.founded_year}
              </span>
              <span style={{ fontSize: 12, color: TEXT3, display: "flex", alignItems: "center", gap: 5 }}>
                <Users size={12} /> {startup.team_size} people
              </span>
            </div>
          </div>

          {/* Score + actions */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}>
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: 14, padding: "12px 20px", textAlign: "center",
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: parseInt(score) >= 80 ? "#10b981" : BLUE, letterSpacing: "-0.03em" }}>
                {score}
              </div>
              <div style={{ fontSize: 9, color: TEXT3, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Relevance score</div>
            </div>
            {startup.website_url && (
              <a
                href={startup.website_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 14px", borderRadius: 12,
                  background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
                  color: "#93c5fd", fontSize: 12, fontWeight: 500, textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(59,130,246,0.12)")}
              >
                <Globe size={12} /> Website <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {startup.short_description && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: TEXT3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>About</h2>
            <p style={{ fontSize: 14, color: TEXT2, fontWeight: 300, lineHeight: 1.75 }}>
              {startup.short_description}
            </p>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <StatCard label="Funding stage" value={startup.funding_stage} icon={TrendingUp} accent={BLUE} />
          <StatCard label="Team size" value={`${startup.team_size} people`} icon={Users} accent="#a855f7" />
          {startup.revenue_last_12m != null && (
            <StatCard label="Revenue (12m)" value={formatCurrency(startup.revenue_last_12m)} icon={DollarSign} accent="#10b981" />
          )}
          {startup.revenue_cagr_3y != null && (
            <StatCard label="3Y CAGR" value={`${startup.revenue_cagr_3y >= 0 ? "↑" : "↓"}${Math.abs(startup.revenue_cagr_3y)}%`} icon={BarChart3} accent={startup.revenue_cagr_3y >= 0 ? "#10b981" : "#ef4444"} />
          )}
          <StatCard label="GDPR" value={startup.gdpr_compliant ? "Compliant" : "Not stated"} icon={Shield} accent={startup.gdpr_compliant ? "#10b981" : TEXT3} />
          <StatCard label="Investor interest" value={`${startup.heart_count ?? 0} saves`} icon={Heart} accent="#ef4444" />
        </div>

        {/* Tags */}
        {startup.secondary_categories && startup.secondary_categories.length > 0 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "20px 24px", marginBottom: 24 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: TEXT3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Subcategories</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {startup.secondary_categories.map(sub => (
                <span key={sub} style={{
                  fontSize: 11, color: TEXT2, fontWeight: 500,
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`,
                  borderRadius: 999, padding: "4px 12px",
                }}>
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to dashboard */}
        <div style={{ paddingTop: 24, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center" }}>
          <Link href="/dashboard" style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, color: TEXT2, textDecoration: "none",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT1)}
            onMouseLeave={e => (e.currentTarget.style.color = TEXT2)}
          >
            <ArrowLeft size={13} /> Back to Discover
          </Link>
        </div>
      </main>
    </div>
  );
}

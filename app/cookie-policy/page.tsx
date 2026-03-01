"use client";

import Link from "next/link";
import { TrendingUp, ArrowLeft, Shield, BarChart3, Settings } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div style={{ background: "#060608", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
      `}</style>

      {/* Ambient orb */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-15%", right: "-10%", width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
        }} />
      </div>

      {/* Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(6,6,8,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "14px 40px", display: "flex", alignItems: "center",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={13} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>InvestTable</span>
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 12,
          color: "rgba(255,255,255,0.3)", textDecoration: "none",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
        >
          <ArrowLeft size={13} /> Back
        </Link>
      </header>

      {/* Content */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Shield size={18} color="rgba(139,92,246,0.7)" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(139,92,246,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Privacy
            </span>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem,5vw,3rem)",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em", marginBottom: 12,
          }}>
            Cookie Policy
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
            Last updated: February 2026
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontWeight: 300, lineHeight: 1.7, marginTop: 16, maxWidth: 560 }}>
            We keep this simple: InvestTable uses only the minimum cookies necessary to keep your session secure
            and your preferences intact. No tracking, no advertising networks, no data brokers.
          </p>
        </div>

        {/* Cookie types */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 52 }}>
          {[
            {
              icon: Shield,
              name: "Strictly necessary cookies",
              badge: "Always active",
              badgeColor: "#10b981",
              desc: "These cookies are essential for the platform to function. They maintain your login session and keep your account secure. They cannot be disabled.",
              examples: [
                "sb-access-token — Supabase authentication session",
                "sb-refresh-token — Session renewal token",
              ],
            },
            {
              icon: Settings,
              name: "Functional cookies",
              badge: "Optional",
              badgeColor: "#3b82f6",
              desc: "These cookies remember your preferences such as filter settings, your selected view mode (map vs. list), and UI state. Disabling them means preferences won't be saved between sessions.",
              examples: [
                "invest-table-filters — Saved filter preferences",
                "invest-table-view — Map or list view preference",
                "nps_last_submitted — Prevents showing feedback survey repeatedly",
              ],
            },
            {
              icon: BarChart3,
              name: "Analytics cookies",
              badge: "Not used",
              badgeColor: "rgba(255,255,255,0.25)",
              desc: "We currently do not use any third-party analytics or tracking cookies. We do not use Google Analytics, Meta Pixel, Hotjar, or similar tools. If this ever changes, we will update this policy and request your explicit consent.",
              examples: [],
            },
          ].map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.name} style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 18, padding: "22px 22px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Icon size={15} color={section.badgeColor} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                    {section.name}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: section.badgeColor,
                    background: `${section.badgeColor}18`,
                    border: `1px solid ${section.badgeColor}30`,
                    borderRadius: 999, padding: "2px 8px", marginLeft: "auto",
                  }}>
                    {section.badge}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.7, marginBottom: section.examples.length ? 12 : 0 }}>
                  {section.desc}
                </p>
                {section.examples.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {section.examples.map(ex => (
                      <div key={ex} style={{
                        fontSize: 11, color: "rgba(255,255,255,0.35)",
                        fontFamily: "monospace",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 8, padding: "6px 10px",
                      }}>
                        {ex}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* GDPR rights */}
        <div style={{
          background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: 18, padding: "24px 22px", marginBottom: 28,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 10 }}>
            Your rights under GDPR
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.75 }}>
            As an EU resident, you have the right to access, correct, and delete your personal data at any time.
            You can withdraw cookie consent by clearing your browser cookies or through your browser settings.
            For data-related requests — including right of access, erasure, or portability — contact us at{" "}
            <a href="mailto:privacy@investtable.eu" style={{ color: "rgba(59,130,246,0.8)", textDecoration: "none" }}>
              privacy@investtable.eu
            </a>.
          </p>
        </div>

        {/* Third-party services */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18, padding: "24px 22px", marginBottom: 48,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 10 }}>
            Third-party services
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.75 }}>
            InvestTable uses <strong style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Supabase</strong> for
            authentication and database services, and <strong style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Stripe</strong> for
            payment processing. These services may set their own strictly-necessary cookies as part of their operation.
            Please refer to their respective privacy policies for details.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} InvestTable · EU GDPR compliant
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Home",  href: "/" },
              { label: "Terms", href: "/terms" },
              { label: "Login", href: "/login" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{
                fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

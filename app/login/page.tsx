"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowLeft, Eye, EyeOff, Building2, Zap, Check, Mail } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .glass-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    color: white;
    transition: border-color 0.2s, background 0.2s;
    width: 100%;
    outline: none;
    font-family: inherit;
  }
  .glass-input:focus {
    border-color: rgba(59,130,246,0.5);
    background: rgba(255,255,255,0.07);
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.22); }
  .btn-primary {
    background: linear-gradient(135deg,#3b82f6,#2563eb);
    box-shadow: 0 0 0 1px rgba(147,197,253,0.2), 0 8px 32px rgba(59,130,246,0.28);
    transition: all 0.2s ease;
    border: none; cursor: pointer; color: white; font-family: inherit;
  }
  .btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 0 1px rgba(147,197,253,0.4), 0 12px 40px rgba(59,130,246,0.4);
    transform: translateY(-1px);
  }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.45);
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes orb { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
  .anim-1 { animation: fadeUp 0.6s ease forwards; }
  .anim-2 { animation: fadeUp 0.6s 0.08s ease both; }
  .anim-3 { animation: fadeUp 0.6s 0.16s ease both; }
  .orb-1 { animation: orb 14s ease-in-out infinite; }
  .orb-2 { animation: orb 20s 4s ease-in-out infinite; }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.06) inset !important;
    -webkit-text-fill-color: white !important;
  }
`;

type Tab = "signin" | "signup";
type Role = "investor" | "startup";

// ─── Role selector ────────────────────────────────────────────────────────────
function RoleSelector({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
      {([
        { id: "investor" as Role, label: "Investor",  icon: Building2, desc: "Scout startups" },
        { id: "startup"  as Role, label: "Startup",   icon: Zap,       desc: "Get discovered" },
      ]).map(opt => {
        const Icon = opt.icon;
        const active = role === opt.id;
        return (
          <button key={opt.id} type="button" onClick={() => onChange(opt.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "12px 8px", borderRadius: 14, cursor: "pointer",
              background: active ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}`,
              transition: "all 0.15s", fontFamily: "inherit",
            }}>
            <Icon size={16} color={active ? "#93c5fd" : "rgba(255,255,255,0.25)"} />
            <span style={{ fontSize: 12, fontWeight: 600, color: active ? "#93c5fd" : "rgba(255,255,255,0.4)" }}>
              {opt.label}
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{opt.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Done state ───────────────────────────────────────────────────────────────
function DoneState({ mode, email }: { mode: Tab; email: string }) {
  const router = useRouter();
  return (
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
      }}>
        {mode === "signup" ? <Mail size={22} color="#10b981" /> : <Check size={22} color="#10b981" />}
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 6 }}>
        {mode === "signup" ? "Check your inbox!" : "Reset email sent!"}
      </p>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 300, lineHeight: 1.6, marginBottom: 20 }}>
        {mode === "signup"
          ? `We sent a confirmation link to ${email}. Click it to activate your account.`
          : `We sent a password reset link to ${email}.`}
      </p>
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="btn-ghost"
        style={{ width: "100%", padding: "10px", borderRadius: 12, fontSize: 13, fontWeight: 500 }}
      >
        Back to login
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab]         = useState<Tab>("signin");
  const [role, setRole]       = useState<Role>("investor");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (tab === "signup" && password !== confirm) { toast.error("Passwords don't match"); return; }

    setLoading(true);
    const supabase = createClient();

    if (tab === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Welcome back!");
      router.push(role === "investor" ? "/dashboard" : "/onboarding");
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { full_name: name, role },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      setDone(true);
    }
  }

  const fieldStyle: React.CSSProperties = {
    padding: "11px 14px", borderRadius: 12, fontSize: 13,
  };

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center px-4"
      style={{ background: "#060608", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{STYLES}</style>

      {/* Orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div className="orb-1" style={{
          position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }} />
        <div className="orb-2" style={{
          position: "absolute", bottom: "-10%", right: "-5%", width: 400, height: 400,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
        }} />
      </div>

      {/* Back */}
      <Link href="/" style={{
        position: "fixed", top: 24, left: 24, zIndex: 10,
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 12, color: "rgba(255,255,255,0.25)",
        textDecoration: "none", transition: "color 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
      >
        <ArrowLeft size={14} /> Back
      </Link>

      {/* Logo */}
      <Link href="/" style={{
        position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10,
        display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 9,
          background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <TrendingUp size={14} color="#fff" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>InvestTable</span>
      </Link>

      {/* Card */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 360 }}>

        {/* Heading */}
        <div className="anim-1" style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: "2rem",
            color: "rgba(255,255,255,0.92)", marginBottom: 6,
          }}>
            {tab === "signin" ? "Welcome back." : "Join InvestTable."}
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
            {tab === "signin"
              ? "Sign in to access the EU startup map."
              : "Create your account to get started."}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="anim-2 glass" style={{ borderRadius: 14, padding: 4, display: "flex", marginBottom: 20 }}>
          {([
            { key: "signin" as Tab, label: "Sign in" },
            { key: "signup" as Tab, label: "Create account" },
          ]).map(({ key, label }) => (
            <button key={key} type="button" onClick={() => { setTab(key); setDone(false); }}
              style={{
                flex: 1, padding: "9px", borderRadius: 10, fontSize: 12, fontWeight: 500,
                background: tab === key ? "rgba(255,255,255,0.09)" : "transparent",
                color: tab === key ? "white" : "rgba(255,255,255,0.3)",
                border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="anim-3 glass" style={{ borderRadius: 24, padding: "28px 24px" }}>

          {done ? (
            <DoneState mode={tab} email={email} />
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Role selector */}
              <RoleSelector role={role} onChange={setRole} />

              {/* Name (signup only) */}
              {tab === "signup" && (
                <div>
                  <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                    {role === "investor" ? "Full name / Organization" : "Company name"}
                  </label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder={role === "investor" ? "Acme Ventures" : "My Startup"}
                    className="glass-input" style={fieldStyle}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@fund.com"
                  className="glass-input" style={fieldStyle}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                    Password
                  </label>
                  {tab === "signin" && (
                    <Link href="/forgot-password" style={{ fontSize: 11, color: "rgba(59,130,246,0.6)", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#93c5fd")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(59,130,246,0.6)")}
                    >
                      Forgot?
                    </Link>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password} onChange={e => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input"
                    style={{ ...fieldStyle, paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)",
                      padding: 4, display: "flex",
                    }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              {tab === "signup" && (
                <div>
                  <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                    Confirm password
                  </label>
                  <input
                    type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input" style={fieldStyle}
                  />
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="btn-primary" style={{
                  width: "100%", padding: "12px", borderRadius: 13,
                  fontSize: 14, fontWeight: 600, marginTop: 4,
                }}>
                {loading ? "Please wait…" : tab === "signin" ? "Sign in →" : "Create account →"}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", textTransform: "uppercase", letterSpacing: "0.08em" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Guest access */}
              <Link href="/dashboard"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "11px", borderRadius: 13, fontSize: 13, fontWeight: 400,
                  color: "rgba(255,255,255,0.4)", textDecoration: "none",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                Continue as guest →
              </Link>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 20 }}>
          By continuing you agree to our{" "}
          <Link href="/cookie-policy" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            Terms & Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}

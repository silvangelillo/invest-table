"use client";

import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { useState } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
  * { -webkit-font-smoothing: antialiased; }
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
    transition: border-color 0.2s;
  }
  .glass-input:focus {
    outline: none;
    border-color: rgba(59,130,246,0.5);
    background: rgba(255,255,255,0.07);
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.25); }
  .gradient-text {
    background: linear-gradient(135deg,#fff 0%,#93c5fd 50%,#fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes orb { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
  .anim-1 { animation: fadeUp 0.7s ease forwards; }
  .anim-2 { animation: fadeUp 0.7s 0.1s ease both; }
  .anim-3 { animation: fadeUp 0.7s 0.2s ease both; }
  .orb-1 { animation: orb 12s ease-in-out infinite; }
  .orb-2 { animation: orb 18s 3s ease-in-out infinite; }
  .btn-primary {
    background: linear-gradient(135deg,#3b82f6,#2563eb);
    box-shadow: 0 0 0 1px rgba(147,197,253,0.2), 0 8px 32px rgba(59,130,246,0.3);
    transition: all 0.2s ease;
  }
  .btn-primary:hover {
    box-shadow: 0 0 0 1px rgba(147,197,253,0.4), 0 12px 40px rgba(59,130,246,0.45);
    transform: translateY(-1px);
  }
  .divider-text {
    display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.2); font-size: 11px;
  }
  .divider-text::before, .divider-text::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
  }
`;

export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-4"
      style={{fontFamily: "'DM Sans', sans-serif"}}>
      <style>{STYLES}</style>

      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div className="orb-1 absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)'}} />
        <div className="orb-2 absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)'}} />
      </div>

      {/* Back */}
      <Link href="/" className="fixed top-6 left-6 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors z-10">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      {/* Logo */}
      <Link href="/" className="fixed top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)'}}>
          <TrendingUp className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-medium text-white/70">InvestTable</span>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="anim-1 text-center mb-8">
          <h1 className="text-white/90 mb-2" style={{fontFamily: "'DM Serif Display', serif", fontSize: '2rem'}}>
            {tab === "signin" ? "Welcome back." : "Join InvestTable."}
          </h1>
          <p className="text-xs text-white/35 font-light">
            {tab === "signin"
              ? "Sign in to access the EU startup map."
              : "Create your account to get started."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="anim-2 glass rounded-2xl p-1 flex mb-6">
          {[
            { key: "signin",  label: "Sign in" },
            { key: "signup",  label: "Create account" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key as any)}
              className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: tab === key ? 'rgba(255,255,255,0.09)' : 'transparent',
                color: tab === key ? 'white' : 'rgba(255,255,255,0.35)',
              }}>
              {label}
            </button>
          ))}
        </div>

        <div className="anim-3 glass rounded-3xl p-7 space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Full name</label>
              <input type="text" placeholder="Jane Doe"
                className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
            </div>
          )}
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Email</label>
            <input type="email" placeholder="you@fund.com"
              className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-white/40 uppercase tracking-widest">Password</label>
              {tab === "signin" && (
                <Link href="/forgot-password" className="text-xs text-blue-400/70 hover:text-blue-400 transition-colors">
                  Forgot?
                </Link>
              )}
            </div>
            <input type="password" placeholder="••••••••"
              className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
          </div>

          <button className="btn-primary w-full py-3 rounded-xl text-sm font-medium text-white mt-2">
            {tab === "signin" ? "Sign in →" : "Create account →"}
          </button>

          <div className="divider-text text-xs uppercase tracking-widest">or</div>

          <Link href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors"
            style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)'}}>
            Continue as guest →
          </Link>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          By continuing you agree to our{" "}
          <Link href="/cookie-policy" className="text-white/40 hover:text-white/60 transition-colors">Terms & Privacy</Link>
        </p>
      </div>
    </div>
  );
}

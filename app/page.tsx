import Link from "next/link";
import { ArrowRight, TrendingUp, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white overflow-x-hidden">

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        * { -webkit-font-smoothing: antialiased; }

        .font-display { font-family: 'DM Serif Display', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .glass-strong {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .glow-text  { text-shadow: 0 0 60px rgba(147,197,253,0.4); }

        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #93c5fd 50%, #fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.05); }
          66%       { transform: translate(-20px, 15px) scale(0.97); }
        }

        .anim-1 { animation: fadeUp 0.8s ease forwards; }
        .anim-2 { animation: fadeUp 0.8s 0.15s ease both; }
        .anim-3 { animation: fadeUp 0.8s 0.30s ease both; }
        .anim-4 { animation: fadeUp 0.8s 0.45s ease both; }
        .anim-fade { animation: fadeIn 1.2s 0.6s ease both; }

        .orb-1 { animation: orb 12s ease-in-out infinite; }
        .orb-2 { animation: orb 16s 4s ease-in-out infinite; }
        .orb-3 { animation: orb 20s 2s ease-in-out infinite; }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          box-shadow: 0 0 0 1px rgba(147,197,253,0.2), 0 8px 32px rgba(59,130,246,0.3);
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          box-shadow: 0 0 0 1px rgba(147,197,253,0.4), 0 12px 40px rgba(59,130,246,0.45);
          transform: translateY(-1px);
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.16) !important;
          background: rgba(255,255,255,0.07) !important;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }
      `}</style>

      {/* ── Background Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div className="orb-1 absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)'}} />
        <div className="orb-2 absolute top-[20%] right-[-15%] w-[500px] h-[500px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)'}} />
        <div className="orb-3 absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)'}} />
      </div>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50" style={{fontFamily: "'DM Sans', sans-serif"}}>
        <div className="glass mx-4 mt-4 rounded-2xl">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}>
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-medium text-white text-sm tracking-tight">InvestTable</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/pricing" className="text-xs font-medium text-white/50 hover:text-white/90 transition-colors tracking-widest uppercase">Pricing</Link>
              <Link href="/onboarding" className="text-xs font-medium text-white/50 hover:text-white/90 transition-colors tracking-widest uppercase">List Startup</Link>
            </div>
            <Link href="/login" className="btn-primary text-xs font-medium text-white px-4 py-2 rounded-xl tracking-wide">
              Sign in →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center" style={{zIndex:2, fontFamily: "'DM Sans', sans-serif"}}>

        <div className="anim-1 glass mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white/60 tracking-widest uppercase font-medium">500+ EU startups · Updated daily</span>
        </div>

        <h1 className="anim-2 text-center mb-6 leading-none" style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(3rem, 8vw, 7rem)'}}>
          <span className="gradient-text glow-text block">The Intelligence</span>
          <span className="text-white/90 block">Layer for</span>
          <em className="gradient-text block">European Venture.</em>
        </h1>

        <p className="anim-3 text-center text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
          style={{fontSize: 'clamp(1rem, 2vw, 1.125rem)', fontWeight: 300}}>
          Real-time signals on 500+ verified startups across every EU member state.
          Built for the investors who move first.
        </p>

        <div className="anim-4 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/login" className="btn-primary font-medium text-white text-sm px-7 py-3.5 rounded-2xl flex items-center gap-2">
            Enter the Map
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/onboarding" className="glass font-medium text-white/70 hover:text-white text-sm px-7 py-3.5 rounded-2xl transition-colors flex items-center gap-2">
            List your startup
            <ChevronRight className="w-4 h-4 opacity-50" />
          </Link>
        </div>

        {/* Stats */}
        <div className="anim-fade mt-20 w-full max-w-2xl mx-auto mb-16">
          <div className="glass rounded-3xl p-8">
            <div className="grid grid-cols-3 gap-8">
              {[
                { n: "500+",  label: "Verified startups" },
                { n: "27",    label: "EU countries" },
                { n: "€2.4B", label: "In tracked funding" },
              ].map(({ n, label }) => (
                <div key={label} className="text-center">
                  <div className="gradient-text mb-1" style={{fontFamily: "'DM Serif Display', serif", fontSize: '3rem', lineHeight: 1}}>{n}</div>
                  <div className="text-xs text-white/35 uppercase tracking-widest font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="anim-fade flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] text-white uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative py-32 px-6" style={{zIndex:2, fontFamily: "'DM Sans', sans-serif"}}>
        <div className="divider mb-32" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-4">The Platform</p>
            <h2 className="text-white/90 leading-tight" style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)'}}>
              Research-grade tools.<br />
              <em className="gradient-text">Zero friction.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Big feature */}
            <div className="glass-strong card-hover rounded-3xl p-8 md:row-span-2 flex flex-col justify-between" style={{minHeight: 360}}>
              <div>
                <div className="w-10 h-10 rounded-2xl mb-6 flex items-center justify-center"
                  style={{background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1))'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.9)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <h3 className="text-white text-2xl mb-3" style={{fontFamily: "'DM Serif Display', serif"}}>EU Startup Map</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  Interactive real-time map of 500+ verified startups across all 27 EU member states.
                  Filter by category, stage, revenue, and CAGR. Every dot is a deal waiting to happen.
                </p>
              </div>
              <div className="mt-8 h-36 rounded-2xl overflow-hidden relative flex items-center justify-center"
                style={{background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.05))'}}>
                <span className="text-xs text-white/15 uppercase tracking-widest">Live map preview</span>
                {[
                  {top:'30%',left:'28%'},{top:'45%',left:'52%'},{top:'25%',left:'60%'},
                  {top:'55%',left:'38%'},{top:'40%',left:'72%'},{top:'60%',left:'65%'},
                  {top:'35%',left:'42%'},{top:'50%',left:'25%'},
                ].map((pos, i) => (
                  <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
                    style={{top: pos.top, left: pos.left, background: i % 2 === 0 ? 'rgba(59,130,246,0.5)' : 'rgba(16,185,129,0.4)'}} />
                ))}
              </div>
            </div>

            {[
              {
                icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
                title: "Smart Alerts",
                desc: "Save searches. Get notified the moment a startup matching your exact criteria goes live.",
              },
              {
                icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
                title: "GDPR Verified",
                desc: "Every startup has confirmed EU compliance. Invest with full confidence.",
              },
              {
                icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
                title: "Pitch Decks",
                desc: "Full decks and financials. Revenue, CAGR, headcount. No back-and-forth required.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="glass card-hover rounded-3xl p-7">
                <div className="w-9 h-9 rounded-xl mb-5 flex items-center justify-center" style={{background: 'rgba(255,255,255,0.06)'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">{icon}</svg>
                </div>
                <h3 className="text-white font-medium mb-2 text-sm tracking-tight">{title}</h3>
                <p className="text-white/35 text-xs leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dual CTA ── */}
      <section className="relative py-32 px-6" style={{zIndex:2, fontFamily: "'DM Sans', sans-serif"}}>
        <div className="divider mb-32" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Two Sides</p>
            <h2 className="text-white/90" style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)'}}>
              One table. Two seats.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-3xl p-8"
              style={{background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.2)'}}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)'}} />
              <p className="text-xs text-blue-400/70 uppercase tracking-widest mb-4 font-medium">For Investors</p>
              <h3 className="text-white text-2xl mb-3" style={{fontFamily: "'DM Serif Display', serif"}}>Scout. Discover. Invest.</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 font-light">
                The full EU startup intelligence layer. Real-time alerts, advanced filters, team seats. Free to start.
              </p>
              <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                View investor plans <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-3xl p-8"
              style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)'}}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)'}} />
              <p className="text-xs text-purple-400/70 uppercase tracking-widest mb-4 font-medium">For Startups</p>
              <h3 className="text-white text-2xl mb-3" style={{fontFamily: "'DM Serif Display', serif"}}>Be Found. Raise Faster.</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 font-light">
                Get in front of Europe's most active investors. Basic visibility is free. Start raising from €39/mo.
              </p>
              <Link href="/onboarding" className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                List your startup <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-32 px-6 text-center" style={{zIndex:2, fontFamily: "'DM Sans', sans-serif"}}>
        <div className="divider mb-32" />
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-white/25 uppercase tracking-widest mb-6">Get Started</p>
          <h2 className="mb-6 leading-tight" style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>
            <span className="gradient-text">The map is live.</span><br />
            <span className="text-white/80">Are you on it?</span>
          </h2>
          <p className="text-white/35 text-sm mb-10 font-light leading-relaxed">
            Join 800+ investors already using InvestTable to source EU deals before anyone else.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="btn-primary font-medium text-white text-sm px-8 py-4 rounded-2xl flex items-center gap-2">
              Enter the Map <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="glass font-medium text-white/50 hover:text-white text-sm px-8 py-4 rounded-2xl transition-colors">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative py-12 px-6" style={{zIndex:2, fontFamily: "'DM Sans', sans-serif", borderTop: '1px solid rgba(255,255,255,0.05)'}}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}>
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-white/60">InvestTable</span>
          </div>
          <div className="flex items-center gap-8">
            {[
              { href: "/pricing",      label: "Pricing" },
              { href: "/onboarding",   label: "List Startup" },
              { href: "/login",        label: "Sign in" },
              { href: "/cookie-policy",label: "Privacy" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-xs text-white/25 hover:text-white/60 transition-colors tracking-widest uppercase">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-white/20">© 2025 InvestTable · EU GDPR compliant</p>
        </div>
      </footer>

    </div>
  );
}

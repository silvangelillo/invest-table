import { OnboardingForm } from "@/components/forms/OnboardingForm";
import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
  * { -webkit-font-smoothing: antialiased; }
  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .gradient-text {
    background: linear-gradient(135deg,#fff 0%,#93c5fd 50%,#fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes orb { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
  .anim-1 { animation: fadeUp 0.7s ease forwards; }
  .anim-2 { animation: fadeUp 0.7s 0.15s ease both; }
  .orb-1 { animation: orb 14s ease-in-out infinite; }
  .orb-2 { animation: orb 20s 5s ease-in-out infinite; }
`;

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white py-16 px-6"
      style={{fontFamily: "'DM Sans', sans-serif"}}>
      <style>{STYLES}</style>

      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div className="orb-1 absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)'}} />
        <div className="orb-2 absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full"
          style={{background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)'}} />
      </div>

      {/* Nav */}
      <div className="fixed top-0 inset-x-0 z-50">
        <div className="glass mx-4 mt-4 rounded-2xl">
          <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)'}}>
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/70">InvestTable</span>
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto pt-16">
        <div className="anim-1 mb-10">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">For Startups</p>
          <h1 className="text-white/90 leading-tight mb-3"
            style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)'}}>
            Get on the map.<br />
            <em className="gradient-text">Get discovered.</em>
          </h1>
          <p className="text-white/40 text-sm font-light leading-relaxed">
            1,000+ EU investors are searching the map right now. Takes under 5 minutes.
          </p>
        </div>

        <div className="anim-2 glass rounded-3xl p-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}


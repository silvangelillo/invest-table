import Link from "next/link";
import { Globe, Bell, Shield, ArrowRight, TrendingUp, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  {
    icon: Globe,
    title: "EU Startup Map",
    desc: "Interactive map of 500+ verified startups across all EU member states. Filter by category, city, and stage.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    desc: "Save searches and receive instant notifications when new startups matching your criteria go live.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Shield,
    title: "GDPR Verified",
    desc: "Every startup on the platform has confirmed GDPR compliance — invest with confidence.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: TrendingUp,
    title: "Pitch Decks",
    desc: "Access full pitch decks and detailed company profiles instantly — no back-and-forth required.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">InvestTable</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/onboarding">
              <Button variant="ghost" size="sm">List your startup</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Investor Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" />
            500+ EU startups · Updated daily
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Discover Europe's<br />
            <span className="text-blue-600">next unicorns</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            InvestTable is the premier discovery platform for EU startup investments.
            Real-time map, smart alerts, GDPR-verified pitch decks.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/pricing">
              <Button size="lg" className="gap-2 shadow-lg shadow-blue-200">
                See pricing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="secondary" size="lg">
                Register your startup →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything you need to invest smarter
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-glass hover:shadow-glass-lg hover:-translate-y-1 transition-all duration-200">
                  <div className={`w-10 h-10 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Two sides of the same table
          </h2>
          <p className="text-gray-500 text-center mb-12">Whether you invest or raise — InvestTable has a plan for you.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Investor CTA */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">For Investors</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Scout EU startups, set alerts, and manage deal flow as a team. Free to start, from €39/seat.
              </p>
              <Link href="/pricing#investors">
                <button className="w-full bg-white text-blue-700 font-semibold py-2.5 rounded-2xl text-sm hover:bg-blue-50 transition-colors">
                  View investor plans →
                </button>
              </Link>
            </div>
            {/* Startup CTA */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">For Startups</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Get discovered by EU investors. Basic visibility is free. Start raising actively from €39/month.
              </p>
              <Link href="/pricing#startups">
                <button className="w-full bg-white text-gray-900 font-semibold py-2.5 rounded-2xl text-sm hover:bg-gray-100 transition-colors">
                  View startup plans →
                </button>
              </Link>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Compare all plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">InvestTable</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-xs text-gray-400 hover:text-gray-600">Pricing</Link>
            <Link href="/onboarding" className="text-xs text-gray-400 hover:text-gray-600">List a Startup</Link>
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">Dashboard</Link>
          </div>
          <p className="text-xs text-gray-400">© 2025 InvestTable. All rights reserved. EU GDPR compliant.</p>
        </div>
      </footer>
    </div>
  );
}

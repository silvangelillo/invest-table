import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900">InvestTable</span>
        </Link>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-16 prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: February 2026</p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What are cookies?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help the site remember
            your preferences and maintain your session between page loads.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Cookies we use</h2>
          <div className="space-y-4">
            {[
              {
                name: "Strictly necessary cookies",
                color: "bg-green-50 border-green-200",
                badge: "Always active",
                badgeColor: "bg-green-100 text-green-700",
                desc: "These cookies are essential for the platform to function. They maintain your login session and keep your account secure. They cannot be disabled.",
                examples: ["supabase-auth-token — Authentication session", "sb-access-token — Secure access control"],
              },
              {
                name: "Functional cookies",
                color: "bg-blue-50 border-blue-200",
                badge: "Optional",
                badgeColor: "bg-blue-100 text-blue-700",
                desc: "These cookies remember your preferences such as filter settings, selected view mode (map/list), and language. Disabling them means these preferences won't be saved between sessions.",
                examples: ["invest-table-filters — Saved filter preferences", "invest-table-view — Map or list view preference"],
              },
              {
                name: "Analytics cookies",
                color: "bg-gray-50 border-gray-200",
                badge: "Not used",
                badgeColor: "bg-gray-100 text-gray-600",
                desc: "We currently do not use any third-party analytics or tracking cookies. We do not use Google Analytics, Meta Pixel, or similar tools. If this changes, we will update this policy and request your consent.",
                examples: [],
              },
            ].map((section) => (
              <div key={section.name} className={`p-5 rounded-2xl border ${section.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">{section.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${section.badgeColor}`}>{section.badge}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">{section.desc}</p>
                {section.examples.length > 0 && (
                  <ul className="space-y-1">
                    {section.examples.map((ex) => (
                      <li key={ex} className="text-[11px] text-gray-500 font-mono bg-white/70 px-2 py-1 rounded-lg">{ex}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Your rights under GDPR</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            As an EU resident, you have the right to access, correct, and delete your personal data. You can withdraw
            cookie consent at any time by clearing your browser cookies or clicking "Manage cookies" in the footer.
            For data-related requests, contact us at{" "}
            <a href="mailto:privacy@investtable.eu" className="text-blue-600 hover:underline">privacy@investtable.eu</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Third-party services</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            InvestTable uses Supabase for authentication and database services, and Stripe for payment processing.
            These services may set their own cookies as part of their operation. Please refer to their respective
            privacy policies for details.
          </p>
        </section>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to InvestTable</Link>
        </div>
      </main>
    </div>
  );
}

import { PricingCard } from "@/components/ui/PricingCard";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string; interval?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const plan = params.plan ?? "investor-plus";
  const interval = params.interval ?? "monthly";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-6 py-12 flex-1">
        {/* Back */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to pricing
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
            <Lock className="w-3 h-3" /> Secure checkout via Stripe
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Unlock investor access</h1>
          <p className="text-gray-500 mt-2">
            Full access to the EU startup map, alerts, and pitch decks.
          </p>
        </div>

        <PricingCard planId={plan} interval={interval} />

        <p className="text-center text-xs text-gray-400 mt-6 max-w-xs mx-auto">
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Payments are processed securely by Stripe.
        </p>
      </div>
    </div>
  );
}

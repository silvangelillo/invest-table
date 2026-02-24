"use client";

import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/lib/stripe";
import { useState } from "react";
import { toast } from "sonner";

interface PricingCardProps {
  planId?: string;
  interval?: string;
}

export function PricingCard({ planId = "investor-plus", interval = "monthly" }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const plan = PLANS[planId] ?? PLANS["investor-plus"];
  const isYearly = interval === "yearly";
  const displayPrice = isYearly ? plan.yearlyPrice : plan.price;

  async function handleCheckout() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.info("Stripe checkout would open here. Add your STRIPE_SECRET_KEY to .env.local to enable.");
    setLoading(false);
  }

  return (
    <div className="relative max-w-sm mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl scale-95 -z-10" />

      <div className="bg-white rounded-3xl border border-blue-100 shadow-glass-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-blue-200" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              {plan.name}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold">€{displayPrice}</span>
            <span className="text-blue-200 text-sm">/{plan.interval}</span>
          </div>
          {isYearly && (
            <p className="text-blue-200 text-xs mt-1">Billed annually · save 2 months</p>
          )}
          <p className="text-blue-200 text-sm mt-2">{plan.name} · EU Startup Map</p>
        </div>

        {/* Features */}
        <div className="p-6 space-y-3">
          {plan.features.map((feat) => (
            <div key={feat} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">{feat}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <Button
            size="lg"
            className="w-full"
            loading={loading}
            onClick={handleCheckout}
          >
            Start Investing Today
          </Button>
          <p className="text-center text-xs text-gray-400 mt-3">
            Cancel anytime · Secure payment via Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

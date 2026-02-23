// ─── Stripe Subscription Manager ─────────────────────────────────────────────
// Handles both investor seat-based and startup tier subscriptions

export const STRIPE_PRODUCTS = {
  // Investor seats: 39€/seat/month
  investor_seat: {
    price_id: process.env.STRIPE_INVESTOR_SEAT_PRICE_ID ?? "price_investor_seat",
    unit_price: 3900, // cents
    currency: "eur",
    label: "Investor Seat",
  },
  // Startup Plus: 39€/month
  startup_plus: {
    price_id: process.env.STRIPE_STARTUP_PLUS_PRICE_ID ?? "price_startup_plus",
    unit_price: 3900,
    currency: "eur",
    label: "Startup Plus",
  },
  // Startup Ultra: 79€/month
  startup_ultra: {
    price_id: process.env.STRIPE_STARTUP_ULTRA_PRICE_ID ?? "price_startup_ultra",
    unit_price: 7900,
    currency: "eur",
    label: "Startup Ultra",
  },
};

// ─── Create investor org checkout (seat-based) ────────────────────────────────
export async function createInvestorCheckout(
  email: string,
  seats: number,
  organizationName: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: STRIPE_PRODUCTS.investor_seat.price_id,
          quantity: seats,
        },
      ],
      metadata: {
        type:              "investor_org",
        organization_name: organizationName,
        seats:             String(seats),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    });

    return { url: session.url };
  } catch (err: any) {
    return { url: null, error: err.message };
  }
}

// ─── Update seat quantity on existing subscription ────────────────────────────
export async function updateSeatQuantity(
  subscriptionId: string,
  newSeats: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0]?.id;
    if (!itemId) return { success: false, error: "Subscription item not found" };

    await stripe.subscriptionItems.update(itemId, { quantity: newSeats });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Create startup tier checkout ─────────────────────────────────────────────
export async function createStartupTierCheckout(
  email: string,
  tier: "plus" | "ultra",
  startupId: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });

    const product = tier === "ultra"
      ? STRIPE_PRODUCTS.startup_ultra
      : STRIPE_PRODUCTS.startup_plus;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: product.price_id, quantity: 1 }],
      metadata: { type: "startup_tier", startup_id: startupId, tier },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?success=true&startup_id=${startupId}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?tier_canceled=true`,
    });

    return { url: session.url };
  } catch (err: any) {
    return { url: null, error: err.message };
  }
}

// ─── Legacy plan (kept for compatibility) ────────────────────────────────────
export const PLAN = {
  name:     "Investor Pro",
  price:    39,
  currency: "EUR",
  interval: "month",
  features: [
    "Full EU startup map access",
    "Unlimited saved searches",
    "Real-time alerts & notifications",
    "Pitch deck downloads",
    "Advanced filters & analytics",
    "Priority support",
  ],
};

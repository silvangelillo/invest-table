import { loadStripe } from "@stripe/stripe-js";

let stripePromise: ReturnType<typeof loadStripe>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_mock"
    );
  }
  return stripePromise;
}

export const PLAN = {
  name: "Investor Pro",
  price: 39,
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

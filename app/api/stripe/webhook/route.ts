import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        // Update investor subscription status in Supabase
        await supabase
          .from("investors")
          .update({
            stripe_customer_id:  session.customer,
            subscription_status: "active",
          })
          .eq("email", session.customer_email);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        await supabase
          .from("investors")
          .update({ subscription_status: "canceled" })
          .eq("stripe_customer_id", sub.customer);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        await supabase
          .from("investors")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", invoice.customer);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Stripe Webhook Error]", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import { createHmac, timingSafeEqual } from "crypto";

import { supabaseAdmin } from "@/app/lib/supabase-admin";
import { pricingPlans, type PricingPlanId } from "@/src/pricing/plans";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret || !signature) {
    return new Response("Webhook configuration missing", { status: 401 });
  }

  const expectedSignature = createHmac("sha512", secret).update(rawBody).digest();
  const suppliedSignature = Buffer.from(signature, "hex");
  const signatureIsValid =
    suppliedSignature.length === expectedSignature.length &&
    timingSafeEqual(suppliedSignature, expectedSignature);

  if (!signatureIsValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: {
    event?: string;
    data?: {
      status?: string;
      reference?: string;
      amount?: number;
      currency?: string;
      metadata?: {
        user_id?: string;
        plan?: PricingPlanId;
      };
      customer?: {
        customer_code?: string;
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (event.event !== "charge.success") {
    return new Response("Event ignored", { status: 200 });
  }

  const transaction = event.data;
  const userId = transaction?.metadata?.user_id;
  const planId = transaction?.metadata?.plan;
  const plan = pricingPlans.find((item) => item.id === planId);

  if (
    !transaction?.reference ||
    !userId ||
    !plan ||
    plan.price <= 0 ||
    transaction.status !== "success" ||
    transaction.currency !== "NGN" ||
    transaction.amount !== plan.price * 100
  ) {
    return new Response("Invalid transaction", { status: 400 });
  }

  const periodEnd = new Date();
  periodEnd.setUTCDate(periodEnd.getUTCDate() + 30);

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan: plan.id,
      status: "active",
      paystack_reference: transaction.reference,
      paystack_customer_code: transaction.customer?.customer_code ?? null,
      current_period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Could not activate Paystack subscription", error);
    return new Response("Could not activate subscription", { status: 500 });
  }

  return new Response("Webhook processed", { status: 200 });
}

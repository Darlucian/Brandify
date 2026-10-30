"use server";

import { pricingPlans, type PricingPlanId } from "@/src/pricing/plans";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { supabaseAdmin } from "@/app/lib/supabase-admin";

export type { PricingPlanId } from "@/src/pricing/plans";

export async function initiatePlanCheckout(payload: {
  plan: PricingPlanId;
}) {
  const plan = pricingPlans.find((item) => item.id === payload.plan);

  if (!plan) {
    throw new Error("Unknown plan selected");
  }

  if (plan.id === "starter" || plan.price <= 0) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("You must be signed in to activate the Starter plan.");
    }

    const { error: subscriptionError } = await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan: "starter",
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (subscriptionError) {
      throw new Error(`Could not activate Starter: ${subscriptionError.message}`);
    }

    return {
      ok: true,
      status: "active",
      plan: plan.id,
      message: "Starter is free.",
    };
  }

  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (!paystackSecretKey || !appUrl) {
    return {
      ok: false,
      status: "pending",
      plan: payload.plan,
      amount: plan.price,
      message:
        "Paystack is not configured yet. Add PAYSTACK_SECRET_KEY and NEXT_PUBLIC_APP_URL.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    throw new Error("You must be signed in to purchase a plan.");
  }

  const reference = `brandify-${plan.id}-${user.id.slice(0, 8)}-${Date.now()}`;
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: plan.price * 100,
      currency: "NGN",
      reference,
      callback_url: `${appUrl}/pricing/verify`,
      metadata: {
        user_id: user.id,
        plan: plan.id,
      },
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.status || !result.data?.authorization_url) {
    throw new Error(result.message || "Could not start Paystack checkout.");
  }

  return {
    ok: true,
    status: "ready",
    plan: plan.id,
    amount: plan.price,
    reference,
    message: "Checkout created successfully.",
    checkoutUrl: result.data.authorization_url as string,
  };
}

export async function verifyPlanCheckout(reference: string) {
  if (!reference) {
    throw new Error("Payment reference is required");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );
  const result = await response.json();
  const transaction = result.data;

  if (
    !response.ok ||
    !result.status ||
    transaction?.status !== "success" ||
    transaction?.currency !== "NGN"
  ) {
    return {
      ok: false,
      status: "failed",
      reference,
      message: "This payment has not been confirmed successfully.",
    };
  }

  const paidPlan = transaction.metadata?.plan as PricingPlanId | undefined;
  const plan = pricingPlans.find((item) => item.id === paidPlan);

  if (
    !plan ||
    plan.price <= 0 ||
    transaction.amount !== plan.price * 100
  ) {
    return {
      ok: false,
      status: "invalid",
      reference,
      message: "This payment does not match your account or selected plan.",
    };
  }

  return {
    ok: true,
    status: "active",
    plan: plan.id,
    reference,
    message: `${plan.name} is now active.`,
  };
}

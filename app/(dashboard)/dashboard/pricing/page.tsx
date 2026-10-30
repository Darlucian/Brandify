"use client";

import { ArrowRight, Check, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useState, useTransition } from "react";

import { initiatePlanCheckout } from "@/src/actions/action";
import { pricingPlans, type PricingPlanId } from "@/src/pricing/plans";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanId | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleCheckout = (planId: PricingPlanId) => {
    setSelectedPlan(planId);
    setStatusMessage("");

    startTransition(async () => {
      const result = await initiatePlanCheckout({ plan: planId });
      if (result.status === "ready" && result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }

      if (result.status === "active") {
        window.location.assign("/dashboard");
        return;
      }

      setStatusMessage(result.message);
    });
  };

  return (
    <main className="min-h-screen bg-[#F7F2EE] px-4 py-10 text-[#241C1C] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B5F5A]">
            Flexible plans
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[#241C1C] sm:text-5xl">
            Pick the plan that matches your creative journey.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#6B5F5A] sm:text-lg">
            Start free, upgrade when you need more structure, and keep your best ideas close as your workflow grows.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isHighlight = plan.highlight;

            return (
              <article
                key={plan.id}
                className={[
                  "relative flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-all duration-200",
                  isHighlight
                    ? "border-[#1B4B43] bg-[#1B4B43] text-white shadow-[0_20px_50px_rgba(27,75,67,0.18)]"
                    : "border-[#B4B0AE]/60 bg-white text-[#241C1C]",
                ].join(" ")}
              >
                {plan.badge ? (
                  <span
                    className={[
                      "absolute right-5 top-0 -translate-y-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
                      isHighlight ? "bg-[#FFD166] text-[#241C1C]" : "bg-[#E0431F]/10 text-[#B33A20]",
                    ].join(" ")}
                  >
                    {plan.badge}
                  </span>
                ) : null}

                <div>
                  <p className={[
                    "text-xs font-bold uppercase tracking-[0.14em]",
                    isHighlight ? "text-white/70" : "text-[#6B5F5A]",
                  ].join(" ")}>
                    {plan.name}
                  </p>

                  <div className="mt-5 flex items-end gap-2">
                    <span className="font-serif text-4xl font-medium tracking-tight">
                      {plan.priceLabel}
                    </span>
                  </div>

                  <p className={[
                    "mt-4 text-sm leading-6",
                    isHighlight ? "text-white/75" : "text-[#6B5F5A]",
                  ].join(" ")}>
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-7 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={[
                          "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full",
                          isHighlight ? "bg-white/10 text-[#FFD166]" : "bg-[#1B4B43]/10 text-[#1B4B43]",
                        ].join(" ")}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className={isHighlight ? "text-white/85" : "text-[#241C1C]"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isPending && isSelected}
                  className={[
                    "mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isHighlight
                      ? "bg-[#FFD166] text-[#241C1C] hover:bg-[#F4C95D] focus:ring-[#FFD166]"
                      : "border border-[#241C1C]/20 bg-[#F7F2EE] text-[#241C1C] hover:bg-[#F0E6E1] focus:ring-[#1B4B43]",
                    (isPending && isSelected) ? "cursor-not-allowed opacity-70" : "",
                  ].join(" ")}
                >
                  {plan.id === "starter" ? "Try free" : "Start plan"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-[#B4B0AE]/60 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B4B43]/10 text-[#1B4B43]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#241C1C]">Secure payment ready</p>
                <p className="text-sm text-[#6B5F5A]">Add your card details in one-click</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#6B5F5A]">
              <Sparkles className="h-4 w-4 text-[#E0431F]" />
              <span>We accept all kinds of cards and payment options.</span>
            </div>
          </div>

          {statusMessage ? (
            <div className="mt-5 rounded-xl border border-[#B4B0AE]/60 bg-[#F7F2EE] p-4 text-sm text-[#241C1C]">
              {statusMessage}
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#B4B0AE]/50 bg-white p-5">
            <Zap className="h-5 w-5 text-[#1B4B43]" />
            <h2 className="mt-3 text-lg font-semibold">Fast setup</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B5F5A]">
              We aim at helping our customers setup their accounts easily and provide support where necessary so you're ready to start.
            </p>
          </div>

          <div className="rounded-2xl border border-[#B4B0AE]/50 bg-white p-5">
            <ShieldCheck className="h-5 w-5 text-[#1B4B43]" />
            <h2 className="mt-3 text-lg font-semibold">Secure by default</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B5F5A]">
              Our payment gateway is not just fast but secure and we aim at keeping your information private and we promote transparency.
            </p>
          </div>

          <div className="rounded-2xl border border-[#B4B0AE]/50 bg-white p-5">
            <Sparkles className="h-5 w-5 text-[#1B4B43]" />
            <h2 className="mt-3 text-lg font-semibold">Personalized</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B5F5A]">
              We provide personalized ideas, to your use case at all times.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

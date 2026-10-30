import Link from "next/link";

import { verifyPlanCheckout } from "@/src/actions/action";

export default async function PricingVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[] }>;
}) {
  const { reference: referenceParam } = await searchParams;
  const reference = Array.isArray(referenceParam) ? referenceParam[0] : referenceParam;

  if (!reference) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-serif text-3xl">Missing payment reference</h1>
        <p className="mt-3 text-[#6B5F5A]">
          Return to pricing and start checkout again.
        </p>
        <Link
          className="mt-6 inline-block rounded-xl bg-[#1B4B43] px-5 py-3 text-sm font-semibold text-white"
          href="/dashboard/pricing"
        >
          Back to pricing
        </Link>
      </main>
    );
  }

  let result;

  try {
    result = await verifyPlanCheckout(reference);
  } catch (error) {
    result = {
      ok: false,
      status: "error",
      reference,
      message: error instanceof Error ? error.message : "Could not verify this payment.",
    };
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <span
        className={`mx-auto flex size-14 items-center justify-center rounded-full text-xl font-bold ${
          result.ok ? "bg-[#1B4B43] text-white" : "bg-[#E0431F]/10 text-[#E0431F]"
        }`}
      >
        {result.ok ? "✓" : "!"}
      </span>
      <h1 className="mt-5 font-serif text-3xl text-[#241C1C]">
        {result.ok ? "Payment confirmed" : "Payment not confirmed"}
      </h1>
      <p className="mt-3 leading-7 text-[#6B5F5A]">{result.message}</p>
      <Link
        className="mt-6 inline-block rounded-xl bg-[#1B4B43] px-5 py-3 text-sm font-semibold text-white"
        href="/dashboard"
      >
        Go to dashboard
      </Link>
    </main>
  );
}

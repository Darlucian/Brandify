import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
type Props = {}
export const PricingSection = (props: Props) => {
return (
   <section
  id="pricing"
  aria-labelledby="pricing-title"
  className="bg-[#1B4B43] px-5 py-20 text-white sm:py-24"
>
  <div className="mx-auto max-w-6xl">
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#FFD166]">
        A good place to begin
      </p>

      <h2
        id="pricing-title"
        className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl"
      >
        Start with one idea worth making.
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/75">
        Try the creator workflow first. We’re shaping future plans around what
        creators find genuinely useful.
      </p>
    </div>

    <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
      <article className="flex flex-col border border-white/20 bg-[#fffefa] p-7 text-[#241C1C] sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E0431F]">
          Starter
        </p>

        <h3 className="mt-4 font-serif text-2xl font-medium">
          Find your first spark
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#6B5F5A]">
          Set up profile for free.
        </p>

        <ul className="mt-7 space-y-3 text-sm text-[#241C1C]">
          <li className="flex items-start gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1B4B43]" />
            Personalized creator context
          </li>
          <li className="flex items-start gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1B4B43]" />
            Content idea suggestions
          </li>
          <li className="flex items-start gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1B4B43]" />
            Save and manage your ideas
          </li>
        </ul>

        <Link
          href="/signup"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-[#241C1C] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1B4B43] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#FFD166] rounded-xl"
        >
          Get started
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </article>
      {/* 2nd  */}
      <article className="flex flex-col border border-white/20 bg-[#fffefa] p-7 text-[#241C1C] sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E0431F]">
        Professional
      </p>
      <h3 className="mt-3 font-serif text-2xl font-medium">Keep momentum gong!</h3>
      <p className="mt-3 text-sm leading-6 text-[#6B5F5A]">
        Never miss a beat, trend or idea!
      </p>
      <ul className="mt-7 space-y-3 text-sm text-[#241C1C]">
        <li className="flex items-start gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1B4B43]"/>
            All in Starter
        </li>
          <li className="flex items-start gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1B4B43]"/>
            Pro Video suggestions  
        </li>
          <li className="flex items-start gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1B4B43]"/>
          Personalized guidance
        </li>
          <li className="flex items-start gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#1B4B43]"/>
            Access to Viral Templates
        </li>
       
        {/* continue */}

      </ul>
         <Link
          href="/signup"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-[#241C1C] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1B4B43] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#FFD166] rounded-xl"
        >
          Get started
          <ArrowRight aria-hidden="true" size={17} />
        </Link>

      </article>

      <article className="relative flex flex-col border border-[#FF5B39] bg-[#fffefa] p-7 text-[#241C1C] sm:p-9">
        <span className="absolute right-5 top-0 -translate-y-1/2 bg-[#FFD166] px-3 py-1 text-xs font-bold uppercase tracking-wide">
          In the works
        </span>

        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B1F10]">
          Creator
        </p>

        <h3 className="mt-4 font-serif text-2xl font-medium">
          More room to grow
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#47251E]">
          Future paid features will be shaped by what creators need most.
        </p>

        <div className="mt-7 border-t border-[#241C1C]/20 pt-5">
          <p className="font-serif text-2xl font-medium">Coming later</p>
          <p className="mt-2 text-sm leading-6 text-[#47251E]">
            No price or paid feature promises until the product direction is
            confirmed.
          </p>
        </div>

        <Link
          href="/signup"
          className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 border border-[#241C1C]/30 px-5 pt-8 text-sm font-semibold text-[#241C1C] transition hover:-translate-y-0.5 hover:bg-[#FBEEE6] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#1B4B43]"
        >
          Try the current experience
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </article>
    </div>
  </div>
</section> 
)
}
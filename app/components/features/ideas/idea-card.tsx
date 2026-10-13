import { ArrowUpRight, Check, Lightbulb } from "lucide-react";

type Idea = {
  id: string;
  type: string;
  hook: string;
  concept: string;
  platform_fit: string[];
  format_guidance: string;
  visual_guidance: string;
  why_this_works: string;
  status: string;
};

const noteStyles: Record<string, string> = {
  video: "bg-[#FFD166] text-[#241C1C]",
  carousel: "bg-[#FF9B79] text-[#241C1C]",
  text: "bg-[#FFFEFA] text-[#241C1C]",
  livestream: "bg-[#1B4B43] text-white",
};

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <article className="h-full overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow-sm">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold">
            B
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Your creator workspace</p>
            <p className="text-xs capitalize text-neutral-500">
              {idea.type} idea
            </p>
          </div>
        </div>
        <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs capitalize text-neutral-600">
          {idea.status}
        </span>
      </header>

      <div className="flex min-h-64 flex-col justify-between bg-neutral-50 p-6 sm:min-h-72 sm:p-8">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          <span>Post concept</span>
          <span>01</span>
        </div>
        <h3 className="py-8 text-center text-2xl font-semibold leading-snug sm:text-3xl">
          {idea.hook}
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {idea.platform_fit.map((platform) => (
            <span
              key={platform}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs capitalize text-neutral-700"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <p className="text-sm leading-6 text-neutral-700">{idea.concept}</p>

        <dl className="space-y-3 border-t border-neutral-100 pt-4 text-sm">
          <div>
            <dt className="font-semibold">Format</dt>
            <dd className="mt-1 leading-5 text-neutral-600">
              {idea.format_guidance}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Visual direction</dt>
            <dd className="mt-1 leading-5 text-neutral-600">
              {idea.visual_guidance}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Why it fits</dt>
            <dd className="mt-1 leading-5 text-neutral-600">
              {idea.why_this_works}
            </dd>
          </div>
        </dl>

        <footer className="flex items-center gap-2 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          <Lightbulb aria-hidden="true" className="size-4" />
          Happy with this input?
          <ArrowUpRight aria-hidden="true" className="ml-auto size-4" />
        </footer>
      </div>
    </article>
  );
}
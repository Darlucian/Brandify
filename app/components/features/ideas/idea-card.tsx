import { Check, ChevronDown, Clock3, Lightbulb, Sparkles, Wrench } from "lucide-react";
import { Card } from "@/app/components/ui/card";
 import { IdeaStatusActions } from "./idea-status-action";

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
  tools_needed?: string[] | null;
  effort?: string | null;
  first_step?: string | null;
  posted_at?: string | null;
};

const statusStyles: Record<string, string> = {
  suggested: "bg-[#E0431F]/10 text-[#B33A20]",
  saved: "bg-[#1B4B43]/10 text-[#1B4B43]",
  posted: "bg-[#241C1C]/[0.06] text-[#6B5F5A]",
};

export function IdeaCard({ idea }: { idea: Idea }) {
  const statusStyle =
    statusStyles[idea.status] ?? "bg-[#241C1C]/[0.06] text-[#6B5F5A]";
  const tools = idea.tools_needed?.filter(Boolean) ?? [];
  const postedDate = idea.posted_at
    ? new Date(idea.posted_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Card
      aria-label={`${idea.type} idea: ${idea.hook}`}
      className="gap-0 overflow-hidden rounded-lg border-[#B4B0AE]/50 bg-white py-0 text-[#241C1C] shadow-sm"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E0431F]/10 text-sm font-bold text-[#E0431F]">
            B
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Brandify draft</p>
            <p className="text-xs capitalize text-[#6B5F5A]">{idea.type}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle}`}
        >
          {idea.status}
        </span>
      </header>

      <section className="mx-3 rounded-md border border-[#B4B0AE]/30 bg-[#FBF8F4] px-5 py-6 sm:px-7">
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B5F5A]">
          <span>Post preview</span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5 text-[#E0431F]" />
            Personalized
          </span>
        </div>

        <h3 className="mx-auto max-w-md py-8 text-center font-serif text-2xl font-medium leading-snug">
          {idea.hook}
        </h3>

        <div className="flex flex-wrap justify-center gap-2">
          {idea.platform_fit.map((platform) => (
            <span
              key={platform}
              className="rounded-full border border-[#B4B0AE]/50 bg-white px-2.5 py-1 text-xs capitalize text-[#6B5F5A]"
            >
              {platform}
            </span>
          ))}
        </div>
      </section>

      <div className="space-y-4 px-5 py-5">
        <p className="text-sm leading-6 text-[#6B5F5A]">{idea.concept}</p>

        {idea.first_step?.trim() ? (
          <div className="flex gap-3 rounded-md border border-[#1B4B43]/15 bg-[#1B4B43]/[0.04] p-3.5">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1B4B43]/10 text-[#1B4B43]">
              <Check aria-hidden="true" className="size-3.5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1B4B43]">
                Start here
              </p>
              <p className="mt-1 text-sm leading-5">{idea.first_step}</p>
            </div>
          </div>
        ) : null}

        <details className="group border-t border-[#B4B0AE]/30 pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 text-sm font-semibold marker:hidden">
            <span>Production notes</span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 text-[#6B5F5A] transition-transform group-open:rotate-180"
            />
          </summary>

          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Format</dt>
              <dd className="mt-1 leading-5 text-[#6B5F5A]">
                {idea.format_guidance}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Visual direction</dt>
              <dd className="mt-1 leading-5 text-[#6B5F5A]">
                {idea.visual_guidance}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Why it fits</dt>
              <dd className="mt-1 leading-5 text-[#6B5F5A]">
                {idea.why_this_works}
              </dd>
            </div>
            {idea.effort?.trim() ? (
              <div>
                <dt className="inline-flex items-center gap-1.5 font-semibold">
                  <Clock3 aria-hidden="true" className="size-3.5 text-[#1B4B43]" />
                  Effort
                </dt>
                <dd className="mt-1 leading-5 text-[#6B5F5A]">
                  {idea.effort}
                </dd>
              </div>
            ) : null}
          </dl>

          {tools.length > 0 ? (
            <div className="mt-4">
              <h4 className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <Wrench aria-hidden="true" className="size-3.5 text-[#E0431F]" />
                Tools
              </h4>
              <ul className="mt-2 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-md bg-[#FBF8F4] px-2.5 py-1.5 text-xs leading-4 text-[#6B5F5A]"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </details>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-[#B4B0AE]/30 px-5 py-3 text-xs text-[#6B5F5A]">
        <span className="inline-flex items-center gap-2">
          <Lightbulb aria-hidden="true" className="size-4 text-[#E0431F]" />
          Content idea
        </span>
        {postedDate ? <span>Posted {postedDate}</span> : null}
        <IdeaStatusActions ideaId={idea.id} status={idea.status} />
      </footer>
    </Card>
  );
}
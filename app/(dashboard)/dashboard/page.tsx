import { ArrowUpRight, Sparkles, Lightbulb, Bookmark, Compass, SparklesIcon } from "lucide-react";
import Link from "next/link";

import { GenerateIdeasButton } from "@/app/components/features/ideas/generate-ideas-button";
import { IdeasFeed } from "@/app/components/features/ideas/ideas-feed";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/app/components/ui/card";

// Replace with real data from your ideas table / profile once wired up.
const overview = {
  totalIdeas: 24,
  savedIdeas: 6,
  streakNum: 4,
};

export default function DashboardPage() {
  return (
    <main className="min-h-full px-4 py-8 text-[#241C1C] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-[#241C1C]/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#E0431F]">
              <Sparkles aria-hidden="true" className="size-4" />
              Your creator workspace
            </p>

            {/* <h1 className="mt-3 max-w-2xl font-serif text-4xl font-medium leading-tight sm:text-5xl">
              Your next good idea starts here.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6B5F5A] sm:text-base">
              Pick up where inspiration left off. Generate a fresh batch when
              you’re ready to create.
            </p> */}
          </div>

          
        </header>

        {/* Overview cards: 2 stats + 1 shortcut, sitting on their own below the header */}
        <section className="mt-3" aria-label="Overview">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-[#241C1C]/10">
              <CardHeader>
                <CardDescription className="text-[#6B5F5A]">
                  Total ideas
                </CardDescription>
                <CardTitle className="font-serif text-3xl font-medium">
                  {overview.totalIdeas}
                </CardTitle>
                <CardAction>
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#E0431F]/10 text-[#E0431F]">
                    <Lightbulb aria-hidden="true" className="size-4" />
                  </span>
                </CardAction>
              </CardHeader>
            </Card>

            <Card className="border-[#241C1C]/10">
              <CardHeader>
                <CardDescription className="text-[#6B5F5A]">
                  Saved ideas
                </CardDescription>
                <CardTitle className="font-serif text-3xl font-medium">
                  {overview.savedIdeas}
                </CardTitle>
                <CardAction>
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#1B4B43]/10 text-[#1B4B43]">
                    <Bookmark aria-hidden="true" className="size-4" />
                  </span>
                </CardAction>
              </CardHeader>
            </Card>

            <Card className="border-[#241C1C]/10">
              <CardHeader>
                <CardDescription className="text-[#6B5F5A]">
                 Current Streak
                </CardDescription>
                <CardTitle className="font-serif text-3xl font-medium">
                  {overview.streakNum}x
                </CardTitle>
                <CardAction>
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#1B4B43]/10 text-[#1B4B43]">
                    <SparklesIcon aria-hidden="true" className="size-4" />
                  </span>
                </CardAction>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="py-7" aria-labelledby="ideas-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xl font-bold uppercase tracking-[0.12em] text-[#6B5F5A]">
                Your idea board
              </p>
              {/* <h2
                id="ideas-heading"
                className="mt-1 font-serif text-2xl font-medium sm:text-3xl"
              >
                Ready when you are
              </h2> */}
            </div>
            

            <a
              href="/dashboard/discover"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B4B43] underline decoration-[#1B4B43]/30 underline-offset-4 hover:decoration-[#1B4B43] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#1B4B43]"
            >
            See more
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
<form>
    
   <input 
   type="text"
   placeholder=""
   />
</form>
          <div className="shrink-0">
            <GenerateIdeasButton />
          </div>

          <div id="idea-list">
            <IdeasFeed />
          </div>
        </section>
      </div>
    </main>
  );
}

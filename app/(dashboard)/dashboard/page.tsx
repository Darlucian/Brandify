import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { GenerateIdeasButton } from "@/app/components/features/ideas/generate-ideas-button";
import { IdeasFeed } from "@/app/components/features/ideas/ideas-feed";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const [totalResult, nextIdeaResult] = await Promise.all([
    supabase
      .from("ideas")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("ideas")
      .select("id, hook, first_step")
      .eq("user_id", user.id)
      .eq("status", "saved")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const queryError = totalResult.error ?? nextIdeaResult.error;

  if (queryError) {
    throw new Error(`Could not load dashboard: ${queryError.message}`);
  }

  const totalIdeas = totalResult.count ?? 0;
  const nextIdea = nextIdeaResult.data;

  return (
    <main className="min-h-full px-4 py-8 text-[#241C1C] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="w-full">
          {/* <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#E0431F]">
              <Sparkles aria-hidden="true" className="size-4" />
              Your creator workspace
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">
              Make your next post count.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6B5F5A]">
              Your ideas, shaped around your goals and ready for your next move.
            </p>
          </div> */}
          <div className="w-full lg:max-w-xl">
            <GenerateIdeasButton />
          </div>
        </header>

        {totalIdeas === 0 ? (
          <section className="border-l-4 border-[#E0431F] bg-white px-5 py-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-[#E0431F]">
              A fresh start
            </p>
            <h2 className="mt-2 font-serif text-2xl font-medium">
              Your idea board is ready.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B5F5A]">
              Generate a personalized batch, then save an idea to choose your
              next step.
            </p>
          </section>
        ) : null}

        <section aria-labelledby="next-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B5F5A]">
                Your next move
              </p>
              <h2
                id="next-heading"
                className="mt-1 font-serif text-2xl font-medium"
              >
                Do this next
              </h2>
            </div>
            <Link
              href="/dashboard/discover"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B4B43] underline decoration-[#1B4B43]/30 underline-offset-4 hover:decoration-[#1B4B43]"
            >
              Idea feed
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <Card className="gap-0 rounded-lg border-[#B4B0AE]/40 bg-white py-0 shadow-sm">
            {nextIdea ? (
              <>
                <CardHeader className="px-5 py-4">
                  <CardDescription className="text-[#1B4B43]">
                    Most recently saved
                  </CardDescription>
                  <CardTitle className="font-serif text-xl font-medium leading-snug">
                    {nextIdea.hook}
                  </CardTitle>
                </CardHeader>
                <CardContent className="border-t border-[#B4B0AE]/25 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6B5F5A]">
                    First step
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#241C1C]">
                    {nextIdea.first_step ||
                      "Choose one small action to get this idea moving."}
                  </p>
                </CardContent>
              </>
            ) : (
              <div className="px-5 py-5">
                <p className="font-medium">No saved idea yet</p>
                <p className="mt-1 text-sm leading-6 text-[#6B5F5A]">
                  Save an idea from your feed and it will appear here as your
                  next step.
                </p>
              </div>
            )}
          </Card>
        </section>

        <section aria-labelledby="ideas-heading" className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B5F5A]">
                Your idea board
              </p>
              <h2
                id="ideas-heading"
                className="mt-1 font-serif text-2xl font-medium"
              >
                Ready when you are
              </h2>
            </div>
          </div>
          <IdeasFeed limit={2} />
        </section>
      </div>
    </main>
  );
}

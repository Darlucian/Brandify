import { redirect } from "next/navigation";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { IdeaStatusChart } from "@/app/components/features/idea-status-chart";
import { MetricBarChart } from "@/app/components/features/metric-bar-chart";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export default async function AnalyticsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const previousWeekStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const [total, suggested, saved, posted, postedThisWeek, postedPreviousWeek, monthlyIdeas] = await Promise.all([
    supabase.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "suggested"),
    supabase.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "saved"),
    supabase.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "posted"),
    supabase.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "posted").gte("posted_at", weekStart),
    supabase.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "posted").gte("posted_at", previousWeekStart).lt("posted_at", weekStart),
    supabase.from("ideas").select("status, created_at, posted_at").eq("user_id", user.id).gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString()),
  ]);

  const queryError = [total, suggested, saved, posted, postedThisWeek, postedPreviousWeek, monthlyIdeas]
    .map((result) => result.error)
    .find(Boolean);

  if (queryError) throw new Error(`Could not load analytics: ${queryError.message}`);

  let generationsRemaining: number | null = null;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const limiter = new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        prefix: "link-pro:ideas",
      });
      generationsRemaining = (await limiter.getRemaining(user.id)).remaining;
    } catch (error) {
      console.error("Could not read generation quota", error);
    }
  }

  const monthlyChartData = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date();
    monthDate.setDate(1);
    monthDate.setMonth(monthDate.getMonth() - 5 + index);

    return {
      key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
      month: monthDate.toLocaleDateString("en-US", { month: "short" }),
      suggested: 0,
      saved: 0,
      posted: 0,
    };
  });

  for (const idea of monthlyIdeas.data ?? []) {
    const createdAt = new Date(idea.created_at);
    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const month = monthlyChartData.find((item) => item.key === key);
    if (!month || (idea.status !== "suggested" && idea.status !== "saved" && idea.status !== "posted")) continue;

    month[idea.status as "suggested" | "saved" | "posted"] += 1;
  }

  const chartData = monthlyChartData.map(({ key: _key, ...month }) => month);
  const totalIdeas = total.count ?? 0;
  const postedCount = posted.count ?? 0;
  const conversionRate = totalIdeas
    ? Math.round((postedCount / totalIdeas) * 100)
    : 0;

  const conversionChartData = monthlyChartData.map((month) => {
    const created = month.suggested + month.saved + month.posted;
    return { label: month.month, current: month.posted, previous: created };
  });

  const thisWeekPosts = postedThisWeek.count ?? 0;
  const previousWeekPosts = postedPreviousWeek.count ?? 0;
  const weeklyChartData = [{
    label: "This week",
    current: thisWeekPosts,
    previous: previousWeekPosts,
  }];

  return (
    <main className="min-h-full px-4 py-8 text-[#241C1C] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B5F5A]">Your progress</p>
          <h1 className="mt-1 font-serif text-3xl font-medium sm:text-4xl">Analytics</h1>
          <p className="mt-2 text-sm leading-6 text-[#6B5F5A]">
            See how your ideas are moving from suggestion to published content.
          </p>
        </header>

        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="md:col-span-2 xl:col-span-1">
            <IdeaStatusChart data={chartData} />
          </div>

          <MetricBarChart
            title="Ideas turned into posts"
            description="Monthly conversion"
            total={`${conversionRate}%`}
            data={conversionChartData}
            currentLabel="Posted"
            previousLabel="Total ideas"
          />

          <MetricBarChart
            title="Posted this week"
            description="Weekly activity"
            total={`${thisWeekPosts}`}
            data={weeklyChartData}
            currentLabel="This week"
            previousLabel="Previous week"
          />
        </div>

        <Card className="rounded-xl border-[#B4B0AE]/50 bg-white py-0 shadow-sm">
          <CardHeader className="flex-row items-center justify-between px-5 py-4">
            <div>
              <CardDescription className="text-[#6B5F5A]">Generation quota</CardDescription>
              <CardTitle className="mt-1 font-serif text-xl font-medium text-[#241C1C]">
                {generationsRemaining ?? "—"} remaining this hour
              </CardTitle>
            </div>
            <span className="rounded-full bg-[#E0431F]/10 px-3 py-1 text-xs font-semibold text-[#B33A20]">
              {totalIdeas} total ideas
            </span>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
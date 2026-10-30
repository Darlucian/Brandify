"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/app/components/ui/chart";

const chartConfig = {
  suggested: { label: "Suggested", color: "#E0431F" },
  saved: { label: "Saved", color: "#E9A23B" },
  posted: { label: "Posted", color: "#1B4B43" },
} satisfies ChartConfig;

export function IdeaStatusChart({
  data,
}: {
  data: { month: string; suggested: number; saved: number; posted: number }[];
}) {
  return (
    <Card className="h-full rounded-xl border-[#B4B0AE]/50 bg-white py-0 shadow-sm">
      <CardHeader className="px-5 py-5">
        <CardDescription className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B5F5A]">
          Idea pipeline
        </CardDescription>
        <CardTitle className="font-serif text-xl font-medium">Ideas created over time</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-5 sm:px-4">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="#B4B0AE" strokeOpacity={0.25} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#6B5F5A", fontSize: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area dataKey="posted" type="natural" fill="var(--color-posted)" fillOpacity={0.35} stroke="var(--color-posted)" stackId="a" />
              <Area dataKey="saved" type="natural" fill="var(--color-saved)" fillOpacity={0.35} stroke="var(--color-saved)" stackId="a" />
              <Area dataKey="suggested" type="natural" fill="var(--color-suggested)" fillOpacity={0.35} stroke="var(--color-suggested)" stackId="a" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

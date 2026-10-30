"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/app/components/ui/chart";

export type MetricBarPoint = {
  label: string;
  current: number;
  previous: number;
};

export function MetricBarChart({
  title,
  description,
  total,
  data,
  currentLabel,
  previousLabel,
}: {
  title: string;
  description: string;
  total: string;
  data: MetricBarPoint[];
  currentLabel: string;
  previousLabel: string;
}) {
  const chartConfig = {
    current: { label: currentLabel, color: "#1B4B43" },
    previous: { label: previousLabel, color: "#E0431F" },
  } satisfies ChartConfig;

  return (
    <Card className="h-full gap-0 rounded-xl border-[#B4B0AE]/50 bg-white py-0 shadow-sm">
      <CardHeader className="px-5 py-5">
        <CardDescription className="text-[#6B5F5A]">{description}</CardDescription>
        <CardTitle className="font-serif text-3xl font-medium">{total}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-5 sm:px-4">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={data} margin={{ left: -16, right: 4 }}>
              <CartesianGrid vertical={false} stroke="#B4B0AE" strokeOpacity={0.25} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#6B5F5A", fontSize: 11 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="current" fill="var(--color-current)" radius={4} />
              <Bar dataKey="previous" fill="var(--color-previous)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="mt-2 text-sm font-medium text-[#241C1C]">{title}</p>
      </CardContent>
    </Card>
  );
}

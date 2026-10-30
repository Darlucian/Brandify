"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/app/lib/utils";

export type ChartConfig = Record<string, { label?: React.ReactNode; color?: string }>;

type ChartContextProps = { config: ChartConfig };

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a ChartContainer");
  return context;
}

function ChartContainer({
  id,
  className,
  config,
  children,
}: React.ComponentProps<"div"> & { config: ChartConfig; id?: string }) {
  const chartId = React.useId().replace(/:/g, "");
  const uniqueId = id ?? `chart-${chartId}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={uniqueId}
        style={Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color])) as React.CSSProperties}
        className={cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-sector[stroke='#fff']]:stroke-transparent", className)}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  nameKey,
  hideLabel = false,
  indicator = "dot",
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
  payload?: Array<{ name?: string; value?: number; dataKey?: string; color?: string; payload?: Record<string, unknown> }>;
  label?: string;
  nameKey?: string;
  hideLabel?: boolean;
  indicator?: "dot" | "line" | "dashed";
}) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-32 rounded-lg border border-[#B4B0AE]/40 bg-white px-3 py-2 shadow-md">
      {!hideLabel ? <p className="mb-1 font-medium text-[#241C1C]">{label}</p> : null}
      {payload.map((item) => {
        const key = nameKey ?? item.name ?? item.dataKey ?? "value";
        const itemConfig = config[key] ?? config[String(item.payload?.[key])] ?? {};
        return (
          <div key={String(item.dataKey ?? item.name)} className="flex items-center justify-between gap-4 text-[#6B5F5A]">
            <span className="flex items-center gap-2">
              <span
                className={indicator === "line" ? "h-0.5 w-4" : indicator === "dashed" ? "h-0.5 w-4 border-t-2 border-dashed bg-transparent" : "size-2 rounded-full"}
                style={{ backgroundColor: itemConfig.color }}
              />
              {itemConfig.label ?? key}
            </span>
            <span className="font-semibold text-[#241C1C]">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };

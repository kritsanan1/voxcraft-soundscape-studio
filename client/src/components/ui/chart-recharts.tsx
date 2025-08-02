// This is a placeholder file for shadcn/ui's internal chart-recharts components.
// In a full shadcn/ui setup, these would be generated or provided.
// For now, we'll define basic types to satisfy TypeScript.

import * as React from "react";

export type ChartConfig = Record<string, {
  label?: string;
  color?: string;
  theme?: Record<string, string>;
  unit?: string;
}>;

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  id?: string;
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
);
ChartContainer.displayName = "ChartContainer";

export interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: any[];
  indicator?: "dot" | "line" | "dashed";
  formatter?: (value: any, name: string, item: any) => [any, string] | string;
}

export const ChartTooltip = {
  Content: React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
    ({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  ),
  // Add other ChartTooltip sub-components if needed by the main chart.tsx
};
(ChartTooltip.Content as any).displayName = "ChartTooltipContent";


export interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: any[];
  itemFormatter?: (value: any, entry: any) => React.ReactNode;
}

export const ChartLegend = {
  Content: React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
    ({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  ),
  // Add other ChartLegend sub-components if needed by the main chart.tsx
};
(ChartLegend.Content as any).displayName = "ChartLegendContent";

// Re-exporting for convenience, though not strictly necessary if only used internally by chart.tsx
export {
  ChartContainer as RechartsChartContainer,
  ChartTooltip as RechartsChartTooltip,
  ChartLegend as RechartsChartLegend,
};

// Re-exporting types with Recharts prefix for compatibility
export type RechartsChartConfig = ChartConfig;
export type RechartsChartContainerProps = ChartContainerProps;
export type RechartsChartTooltipContentProps = ChartTooltipContentProps;
export type RechartsChartLegendContentProps = ChartLegendContentProps;
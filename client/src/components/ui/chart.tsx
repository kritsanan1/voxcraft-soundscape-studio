"use client"

import * as React from "react"
import {
  ChartConfig as RechartsChartConfig,
  ChartContainer as RechartsChartContainer,
  ChartContainerProps as RechartsChartContainerProps,
  ChartLegend as RechartsChartLegend,
  ChartLegendContentProps as RechartsChartLegendContentProps,
  ChartTooltip as RechartsChartTooltip,
  ChartTooltipContentProps as RechartsChartTooltipContentProps,
} from "@/components/ui/chart-recharts" // Corrected import path
import { cn } from "@/lib/utils"

const ChartContext = React.createContext<ChartContextProps | null>(null)

type ChartContextProps = {
  config: ChartConfig
}

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

type ChartConfig = RechartsChartConfig

type ChartContainerProps = RechartsChartContainerProps & {
  config: ChartConfig
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`
  return (
    <ChartContext.Provider value={{ config }}>
      <RechartsChartContainer
        id={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </RechartsChartContainer>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, itemConfig]) => itemConfig.theme || itemConfig.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
  ${colorConfig
    .map(([key, itemConfig]) => {
      const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
      return color ? `--color-${key}: ${color};` : null
    })
    .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  RechartsChartTooltipContentProps &
    React.ComponentPropsWithoutRef<typeof RechartsChartTooltip> & {
      hideIndicator?: boolean
    }
>(({ hideIndicator = false, ...props }, ref) => {
  return (
    <RechartsChartTooltip
      ref={ref}
      cursor={false}
      content={
        hideIndicator ? (
          <RechartsChartTooltip.Content {...props} />
        ) : (
          <RechartsChartTooltip.Content
            indicator="dot"
            className="rounded-md border border-border bg-background p-2 text-sm shadow-md"
            {...props}
          />
        )
      }
      {...props}
    />
  )
})
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  RechartsChartTooltipContentProps
>(({ className, ...props }, ref) => {
  const { config } = useChart()
  const payload = props.payload?.[0]

  if (!payload) {
    return null
  }

  return (
    <RechartsChartTooltip.Content
      ref={ref}
      className={cn(
        "rounded-md border border-border bg-background p-2 text-sm shadow-md",
        className
      )}
      {...props}
      formatter={(value: any, name: string, item: any) => { // Explicitly type parameters
        const unit = item?.payload?.unit
        if (unit) {
          return [value, `${name} (${unit})`]
        }
        return [value, name]
      }}
    />
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  RechartsChartLegendContentProps &
    React.ComponentPropsWithoutRef<typeof RechartsChartLegend> & {
      hideIcon?: boolean
    }
>(({ className, hideIcon = false, ...props }, ref) => {
  return (
    <RechartsChartLegend
      ref={ref}
      content={
        <RechartsChartLegend.Content
          className={cn(
            "flex flex-wrap items-center justify-center gap-4",
            className
          )}
          {...props}
          itemFormatter={(value: any, entry: any) => { // Explicitly type parameters
            const key = entry.payload?.name || value
            if (hideIcon) {
              return key
            }
            return (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: entry.color,
                  }}
                />
                {key}
              </span>
            )
          }}
        />
      }
      {...props}
    />
  )
})
ChartLegend.displayName = "ChartLegend"

const THEMES = {
  light: "light",
  dark: "dark",
} as const

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartStyle,
}
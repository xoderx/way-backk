import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
const ChartContext = React.createContext<{ config: any } | null>(null)
function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within a ChartContainer")
  return context
}
const ChartContainer = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { config: any }>(
  ({ id, className, children, config, ...props }, ref) => {
    const chartId = React.useId()
    return (
      <ChartContext.Provider value={{ config }}>
        <div ref={ref} className={cn("flex aspect-video justify-center text-xs", className)} {...props}>
          <RechartsPrimitive.ResponsiveContainer>
            {children as any}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"
const ChartTooltip = RechartsPrimitive.Tooltip
const ChartTooltipContent = React.forwardRef<HTMLDivElement, any>(
  ({ active, payload, label, className, hideLabel = false, labelKey, labelFormatter, indicator = "dot" }, ref) => {
    const { config } = useChart()
    if (!active || !payload?.length) return null
    return (
      <div ref={ref} className={cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs shadow-xl", className)}>
        {!hideLabel && (
          <div className="font-medium">
            {labelFormatter ? labelFormatter(label, payload) : config[labelKey || label]?.label || label}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item: any, index: number) => {
            const key = item.name || item.dataKey
            const configItem = config[key]
            return (
              <div key={index} className="flex items-center gap-2">
                {indicator === "dot" && (
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                )}
                <span className="text-muted-foreground">{configItem?.label || key}</span>
                <span className="ml-auto font-mono font-medium tabular-nums">{item.value}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"
const ChartLegend = RechartsPrimitive.Legend
const ChartLegendContent = React.forwardRef<HTMLDivElement, any>(
  ({ className, payload, verticalAlign = "bottom" }, ref) => {
    const { config } = useChart()
    if (!payload?.length) return null
    return (
      <div ref={ref} className={cn("flex items-center justify-center gap-4 pt-3", className)}>
        {payload.map((item: any, index: number) => {
          const key = item.value || item.dataKey
          const configItem = config[key]
          return (
            <div key={index} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-muted-foreground">{configItem?.label || key}</span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
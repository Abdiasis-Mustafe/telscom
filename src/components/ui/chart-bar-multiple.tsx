"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import type { ChartConfig } from "./Chart"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./Chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(220, 90%, 56%)" }, // blue
  mobile: { label: "Mobile", color: "hsl(142, 76%, 40%)" },   // green
} satisfies ChartConfig

export function ChartBarMultiple() {
  return (
    <Card className="flex-1 h-full shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Telesom Group</CardTitle>
        <CardDescription className="text-sm text-slate-500">Jan - Jun 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={chartData}
            className="h-full w-full"
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            barCategoryGap={32}   // spacing between groups
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => val.slice(0, 3)} 
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />

            {/* Thin stylish bars */}
            <Bar 
              dataKey="desktop" 
              fill="var(--color-desktop)" 
              radius={[6, 6, 0, 0]} 
              barSize={14} 
            />
            <Bar 
              dataKey="mobile" 
              fill="var(--color-mobile)" 
              radius={[6, 6, 0, 0]} 
              barSize={14} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

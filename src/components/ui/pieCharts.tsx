"use client"

import React, { useState } from "react"
import ReactApexChart from "react-apexcharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

export function ChartDonut() {
  const [series, setSeries] = useState<number[]>([44, 55, 13, 33])

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Product", "Voice", "Tec", "Other"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
      labels: {
        colors: "#374151", // Tailwind slate-700
      },
    },
    colors: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"], // blue, green, amber, red
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  return (
    <Card className="flex-1 h-full shadow-md rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Analytics</CardTitle>
        <CardDescription className="text-sm text-slate-500">Transactions by Category</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ReactApexChart options={options} series={series} type="donut" width={380} />
      </CardContent>
    </Card>
  )
}

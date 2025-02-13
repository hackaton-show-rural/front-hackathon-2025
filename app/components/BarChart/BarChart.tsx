"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Concluido",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Faltando",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type ChartData = {
  data: {
    month: string
    done: number
    missing: number
  }[]
}

export const BarChartC = ({ data }: ChartData) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relaçao mensal</CardTitle>
        <CardDescription>Março - Agosto 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="missing" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="done" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

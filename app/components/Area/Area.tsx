
"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const AreaC = ({ data }) => {

  const chartConfig = {
    quantity: {
      label: "Quantidade",
      color: "#1052bd",
    },
  } satisfies ChartConfig


  return (
    <Card>
      <CardHeader>
        <CardTitle>Vencimentos por mês</CardTitle>
        <CardDescription>
          Total de vencimentos por mês
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="quantity"
              type="natural"
              fill="var(--color-quantity)"
              fillOpacity={0.4}
              stroke="var(--color-quantity)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


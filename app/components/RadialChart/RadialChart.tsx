"use client"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"


const chartConfig = {
  WARNING: {
    label: "Atenção",
    color: "#FDE047",
  },
  URGENT: {
    label: "Urgente",
    color: "#EF4444",
  },
  REGULAR: {
    label: "Regular",
    color: "#22C55E",
  },
} satisfies ChartConfig

type ChartData = {
  data: {
    WARNING: number,
    URGENT: number,
    REGULAR: number,
  }[]
}

export const RadialChart = ({ data }: ChartData) => {
  const [totalVisitors, setTotalVisitors] = useState(0)
  useEffect(() => {
    let cnt = 0

    if (data?.[0]?.WARNING) {
      cnt += data?.[0]?.WARNING
    }
    if (data?.[0]?.URGENT) {
      cnt += data?.[0]?.URGENT
    }
    if (data?.[0]?.REGULAR) {
      cnt += data?.[0]?.REGULAR
    }

    setTotalVisitors(cnt)
  }, [data])


  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Demandas deste mês</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={data}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Demandas
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="REGULAR"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-REGULAR)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="URGENT"
              fill="var(--color-URGENT)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="WARNING"
              fill="var(--color-WARNING)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

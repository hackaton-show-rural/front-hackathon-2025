
"use client";
import { BarChartC } from "@/app/components/BarChart";
import { RadialChart } from "@/app/components/RadialChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { getBar } from "@/app/lib/api/bar";
import { useQuery } from "@tanstack/react-query";
import { getRadial } from "@/app/lib/api/radial";
import { getPie } from "@/app/lib/api/pie";
import { PieChartC } from "@/app/components/PieChart";
import { useState } from "react";

export default function() {
  const generateColorHex = () => {
    // Generate random blue value (0–255)
    const blue = Math.floor(Math.random() * 256);

    // Convert RGB (0, 0, blue) to hex
    const color = (blue).toString(16).padStart(2, '0'); // Blue component
    return `#0000${color}`; // Red and green are fixed to 0
  };
  /*   const { data: barData } = useQuery({ queryKey: ['getBarData'], queryFn: getBar }); */
  const [pieConfig, setPieConfig] = useState({})
  const { data: radialData } = useQuery({
    queryKey: ['getRadialData'], queryFn: async () => {
      let data = await getRadial();
      const lmao = {}
      data.forEach((item) => {
        lmao[item.status] = item.quantity
      })

      return lmao
    },
  });

  const { data: pieData } = useQuery({
    queryKey: ['getPieData'], queryFn: async () => {
      let data = await getPie();
      let config = {}
      let res = data.map((item) => {
        let color = generateColorHex(item.city)
        config[item.city] = {
          label: item.city,
          color: color
        }
        return { ...item, fill: color }
      })

      setPieConfig(config)
      return res
    },
  });


  const data2 = [
    { month: "Janeiro", done: 186, missing: 80 },
    { month: "Fevereiro", done: 305, missing: 200 },
    { month: "Março", done: 237, missing: 120 },
    { month: "Abril", done: 73, missing: 190 },
    { month: "Maio", done: 209, missing: 130 },
    { month: "Junho", done: 214, missing: 140 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 relative gap-4 flex flex-col">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Image src="/docvel.png" alt='asdf' width="100" height="50" />
                </Link>
              </div>
              <div className="flex items-center space-x-2">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 container">
          <Card>
            <CardHeader>
              <CardTitle>Overview do Mês</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <RadialChart data={[radialData]} />
              <PieChartC data={pieData} pieConfig={pieConfig} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso Mensal</CardTitle>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </div>
      </div>
      <Separator className="my-5" />
      <p className="text-center text-sm text-muted-foreground">
        Data updated as of: {(new Date()).toLocaleDateString()}
      </p>
    </main>
  );
}


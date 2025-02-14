
"use client";
import { AreaC } from "@/app/components/Area";
import { RadialChart } from "@/app/components/RadialChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { getArea } from "@/app/lib/api/area";
import { useQuery } from "@tanstack/react-query";
import { getRadial } from "@/app/lib/api/radial";
import { getPie } from "@/app/lib/api/pie";
import { PieChartC } from "@/app/components/PieChart";
import { useState } from "react";

export default function() {
  const generateColorHex = () => {
    // Generate random RGB values in the range 100–255
    const r = Math.floor(Math.random() * 156) + 100; // Range: 100–255
    const g = Math.floor(Math.random() * 156) + 100; // Range: 100–255
    const b = Math.floor(Math.random() * 156) + 100; // Range: 100–255

    // Convert RGB to hex
    const color = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

    return `#${color}`;
  };
  const [pieConfig, setPieConfig] = useState({})

  const { data: areaData } = useQuery({ queryKey: ['getAreaData'], queryFn: getArea });
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
            <CardContent className="m-auto">
              <AreaC data={areaData} />
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


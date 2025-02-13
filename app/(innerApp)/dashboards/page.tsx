
"use client";
import { BarChartC } from "@/app/components/BarChart";
import { RadialChart } from "@/app/components/RadialChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function() {
  const data = [{ missing: 128, done: 22 }];

  const data2 = [
    { month: "Janeiro", done: 186, missing: 80 },
    { month: "Fevereiro", done: 305, missing: 200 },
    { month: "Março", done: 237, missing: 120 },
    { month: "Abril", done: 73, missing: 190 },
    { month: "Maio", done: 209, missing: 130 },
    { month: "Junho", done: 214, missing: 140 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 relative">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/"> <FileText className="h-6 w-6 text-primary" /> </Link>
                <div>
                  <h1 className="text-xl font-semibold">Gerenciamento de Documentos</h1>
                  <p className="text-sm text-muted-foreground">
                    Visualize e gerencie seus documentos
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview do Ano</CardTitle>
          </CardHeader>
          <CardContent>
            <RadialChart data={data} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartC data={data2} />
          </CardContent>
        </Card>
      </div>
      <Separator className="my-5" />
      <p className="text-center text-sm text-muted-foreground">
        Data updated as of: {(new Date()).toLocaleDateString()}
      </p>
    </main>
  );
}


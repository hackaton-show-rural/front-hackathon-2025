"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { getDocuments } from "../lib/api/documents"
import { filterBuilder } from "../lib/filterBuilder"
import { useState } from "react"
import { DocumentsTable } from "@components/DocumentsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, RefreshCw } from "lucide-react"
import { FileDialog } from "../components/FileDialog"
import Link from "next/link"

export default function Home() {
  const [query, setQuery] = useState<string>("")
  const [params, setParams] = useState<{ key: string; value: string }[]>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data, isLoading, fetchNextPage, isFetching, hasNextPage } =
    useInfiniteQuery(
      [`getDocuments`, params, query],
      ({ pageParam }) => {
        let searchParams: { key: string; value: string }[] = []
        if (params?.length) {
          searchParams.map((param) => {
            params.push({
              key: param.key,
              value: param.value,
            })
          })
        }
        if (pageParam) {
          searchParams.push({
            key: "offset",
            value: pageParam.offset,
          })
        }
        if (query) {
          searchParams.push({
            key: "search",
            value: query,
          })
        }
        return getDocuments({
          offset: pageParam?.offset ?? 0,
          limit: 10,
          filter: filterBuilder(searchParams),
        })
      },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.last) {
            return undefined
          }
          return {
            offset: lastPage.number + 1,
            limit: lastPage.size,
          }
        },
        keepPreviousData: false,
      }
    )

  return (
    <main className="min-h-screen bg-gray-50 relative">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-xl font-semibold">Gerenciamento de Documentos</h1>
                  <p className="text-sm text-muted-foreground">
                    Visualize e gerencie seus documentos
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link href={"/dashboards"} className="mr-10 text-sm text-slate-500"> Dashboard </Link>

                {isFetching && (
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar documentos..."
                    className="pl-8 w-64"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={() => setQuery("")}>
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>
              Navegue e gerencie todos os seus registros de documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentsTable
              data={data}
              isLoading={isLoading}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              setQuery={setQuery}
              setParams={setParams}
            />
          </CardContent>
        </Card>
      </div>

      <FileDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </main>
  )
}

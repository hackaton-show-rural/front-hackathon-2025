"use client"
import { useState } from "react"
import { Upload, X, File, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { mutateDocuments } from "@/app/lib/api/documents"
import { useQueryClient } from "@tanstack/react-query"

export const FileDialog = ({ isDialogOpen, setIsDialogOpen }: {
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  const [files, setFiles] = useState<File[]>([])

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await mutateDocuments({ data: { files: files } })
    queryClient.invalidateQueries({ queryKey: ["getDocuments"] })
    setFiles([])
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Documentos</DialogTitle>
          <DialogDescription>Arraste os documentos, ou clique para pesquisar</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="group relative mt-4 flex h-48 w-full cursor-pointer flex-col items-center 
              justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 
              transition-colors hover:bg-gray-100"
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const newFiles = Array.from(e.dataTransfer.files)
              handleFiles(newFiles)
            }}
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || [])
                handleFiles(newFiles)
              }}
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-gray-400 group-hover:text-gray-500" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-primary">Clique para pesquisar</span> ou arraste um documento</p>
              <p className="text-xs text-gray-400">Qualquer arquivo</p>
            </div>
          </div>

          <div className="max-h-[150px] overflow-scroll">
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border 
                    border-gray-200 bg-white p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={files.length === 0}
            >
              Enviar {files.length > 0 && `(${files.length})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

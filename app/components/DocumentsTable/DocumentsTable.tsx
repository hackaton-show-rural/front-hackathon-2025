import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Documents } from '@/app/lib/api/documents';
import Link from 'next/link';
import { Link as LinkIco } from 'lucide-react';

interface Page {
  content: Document[];
  number: number;
  size: number;
  last: boolean;
}

interface DocumentsTableProps {
  data?: {
    pages: Page[];
  };
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  setQuery: (query: string) => void;
  setParams: React.Dispatch<React.SetStateAction<{ key: string; value: string }[] | undefined>>;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  data,
  isLoading,
  fetchNextPage,
  hasNextPage,
  setQuery,
  setParams
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Documents | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const handleDateSelect = (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (selectedDate) {
      setParams(prev => [
        ...(prev?.filter(p => p.key !== 'date') || []),
        { key: 'date', value: format(selectedDate, 'yyyy-MM-dd') }
      ]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleRowClick = (doc: Documents) => {
    setSelectedDocument(doc);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Pesquisar documentos..."
          className="max-w-sm"
          onChange={handleSearch}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] pl-3 text-left font-normal">
              {date ? (
                format(date, "PPP", { locale: ptBR })
              ) : (
                <span>Selecionar data</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableCaption>Lista de documentos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID do Documento</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.pages?.map((page) =>
            page.content?.map((doc) => (
              <TableRow key={doc.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(doc)}
              >
                <TableCell className="font-medium">{doc.id}</TableCell>
                <TableCell>{doc.identifier.name}</TableCell>
                <TableCell>{doc.cnpj}</TableCell>
                <TableCell>
                  {format(parseISO(doc.limitDate), "PPP", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DocumentDialog
        document={selectedDocument}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {hasNextPage && (
        <div className="mt-4 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Carregar Mais"}
          </Button>
        </div>
      )}
    </div>
  );
};



interface DocumentDialogProps {
  document: Documents | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  document,
  open,
  onOpenChange,
}) => {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className='flex flex-row gap-4'>Detalhes do Documento  <Link href={document?.documentUrl || "a"} target='_blank' ><LinkIco className='w-4' /></Link></DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Protocolo:</label>
              <p>{document.protocol}</p>
            </div>
            <div>
              <label className="font-semibold">Número:</label>
              <p>{document.number}</p>
            </div>
            <div>
              <label className="font-semibold">Data Limite:</label>
              <p>  {format(parseISO(document.limitDate), "PPP", { locale: ptBR })}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Identificação</h3>
            <div className="grid gap-2">
              <p><span className="font-medium">Nome:</span> {document.identifier.name}</p>
              <p><span className="font-medium">Endereço:</span> {document.identifier.address}</p>
              <p><span className="font-medium">Cidade:</span> {document.identifier.city}</p>
              <p><span className="font-medium">CEP:</span> {document.identifier.postalCode}</p>
            </div>
          </div>

          {document.conditions.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Condições</h3>
              <ul className="list-disc pl-4 space-y-2">
                {document.conditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog >
  );
};

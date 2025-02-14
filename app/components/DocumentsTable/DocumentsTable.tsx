import React, { useEffect, useState } from 'react';
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
import { Badge } from "@/components/ui/badge";
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
import { Link as LinkIco, Eye } from 'lucide-react';

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
  qParams: any
}


const getStatusColor = (status: string) => {
  switch (status) {
    case "WARNING":
      return "bg-yellow-300 hover:bg-yellow-300 text-yellow-300 text-gray-700";
    case "URGENT":
      return "bg-red-500 hover:bg-red-500 text-red-50";
    case "REGULAR":
      return "bg-green-500 hover:bg-green-500 text-green-50";
    default:
      return "bg-gray-500 text-gray-900";
  }
};

const getStatusName = (status: string) => {
  switch (status) {
    case "WARNING":
      return "Atenção";
    case "URGENT":
      return "Urgente";
    case "REGULAR":
      return "Regular";
    default:
      return "Atrasado";
  }
}



export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  data,
  isLoading,
  fetchNextPage,
  hasNextPage,
  setQuery,
  setParams,
  qParams,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Documents | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);


  useEffect(() => {
    if (qParams && qParams.toString()) {
      setDialogOpen(true)
      setSelectedDocument(data?.pages?.[0].content?.[0])
    }
  }, [data])

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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] pl-3 text-left font-normal">
              {date ? (
                format(date, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Selecionar vencimento</span>
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
        <Input
          placeholder="Pesquisar documentos..."
          className=""
          onChange={handleSearch}
        />
      </div>
      <Table>
        <TableCaption>Lista de documentos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Vencimento</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Atividade</TableHead>
            <TableHead>Status</TableHead>
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
                <TableCell>
                  {format(parseISO(doc.limitDate), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>{doc.identifier.name}</TableCell>
                <TableCell>{doc.cnpj}</TableCell>
                <TableCell>{doc.activity}</TableCell>
                <TableCell >
                  <Badge className={`px-2 font-semibold mt-4 rounded ${getStatusColor(doc.status)}`}>
                    {getStatusName(doc.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye />
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            Detalhes do Documento
            <Link href={document?.documentUrl || "#"} target="_blank">
              <LinkIco className="w-5 hover:text-blue-500 transition-transform hover:scale-110" />
            </Link>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-600">Protocolo:</label>
              <p className="text-gray-900">{document.protocol}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-600">Número:</label>
              <p className="text-gray-900">{document.number}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-600">Data Limite:</label>
              <p className="text-gray-900">
                {format(parseISO(document.limitDate), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
            <div>
              <label className="font-semibold text-gray-600">Status:</label>
              <div>
                <Badge
                  className={`px-2 mt-2 rounded text-md font-bold ${getStatusColor(document.status)}`}
                >
                  {getStatusName(document.status)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Identificação</h3>
            <div className="grid gap-2">
              <p>
                <span className="font-medium text-gray-600">Nome:</span>{" "}
                <span className="text-gray-900">{document.identifier.name}</span>
              </p>
              <p>
                <span className="font-medium text-gray-600">Endereço:</span>{" "}
                <span className="text-gray-900">{document.identifier.address}</span>
              </p>
              <p>
                <span className="font-medium text-gray-600">Cidade:</span>{" "}
                <span className="text-gray-900">{document.identifier.city}</span>
              </p>
              <p>
                <span className="font-medium text-gray-600">CEP:</span>{" "}
                <span className="text-gray-900">{document.identifier.postalCode}</span>
              </p>
            </div>
          </div>

          {document.conditions.length > 0 && (
            <div className="border-t pt-2">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Condições</h3>
              <ul className="list-disc pl-6 space-y-1">
                {document.conditions.map((condition, index) => (
                  <li
                    key={index}
                    className="text-gray-700 leading-relaxed transition-all hover:bg-gray-50 p-2 rounded textx-sm"
                  >
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

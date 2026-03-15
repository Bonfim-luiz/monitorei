import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useUploadPdf, 
  useGetPdfStatus, 
  useGetResults, 
  useSendNotifications 
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  UploadCloud, FileText, CheckCircle2, 
  Search, Mail, AlertCircle, Loader2,
  FileCheck, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isVerifying, setIsVerifying] = useState(false);

  // Queries
  const { data: pdfStatus, isLoading: isLoadingStatus } = useGetPdfStatus();
  const { data: resultsData, isLoading: isLoadingResults, refetch: refetchResults } = useGetResults();

  // Mutations
  const uploadMutation = useUploadPdf({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["/api/pdf/status"] });
        queryClient.invalidateQueries({ queryKey: ["/api/results"] });
        toast({
          title: "PDF Processado com sucesso!",
          description: `${data.pageCount} páginas lidas do arquivo ${data.filename}.`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Falha no Upload",
          description: error?.response?.data?.error || "Não foi possível processar o PDF.",
          variant: "destructive",
        });
      }
    }
  });

  const notifyMutation = useSendNotifications({
    mutation: {
      onSuccess: (data) => {
        toast({
          title: "Notificações Enviadas",
          description: `${data.sent} e-mails enviados com sucesso. ${data.failed > 0 ? `${data.failed} falharam.` : ''}`,
        });
      },
      onError: () => {
        toast({
          title: "Erro no envio",
          description: "Falha ao enviar notificações. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  });

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({ title: "Arquivo inválido", description: "Por favor, envie apenas arquivos PDF.", variant: "destructive" });
        return;
      }
      uploadMutation.mutate({ data: { pdf: file } });
    }
  }, [uploadMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploadMutation.isPending
  });

  const handleVerify = async () => {
    setIsVerifying(true);
    await refetchResults();
    setIsVerifying(false);
    toast({
      title: "Verificação Concluída",
      description: "Os resultados foram atualizados com base no PDF atual.",
    });
  };

  return (
    <div className="flex-1 w-full bg-background/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Painel de Administração</h1>
            <p className="text-muted-foreground mt-1">Gerencie publicações e verifique convocações</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload Card */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 h-full flex flex-col">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" />
                Upload do Diário Oficial
              </h2>
              
              <div 
                {...getRootProps()} 
                className={cn(
                  "flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer",
                  isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-border hover:border-primary/50 hover:bg-muted/30",
                  uploadMutation.isPending && "opacity-50 cursor-wait pointer-events-none"
                )}
              >
                <input {...getInputProps()} />
                {uploadMutation.isPending ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="font-medium text-foreground">Processando PDF...</p>
                    <p className="text-sm text-muted-foreground mt-1">Isso pode levar alguns segundos dependendo do tamanho.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                      <FileText className="w-7 h-7" />
                    </div>
                    <p className="font-semibold text-foreground text-lg mb-1">
                      {isDragActive ? "Solte o PDF aqui..." : "Arraste e solte o PDF do Diário"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar do seu computador</p>
                    <span className="px-4 py-1.5 bg-background border border-border rounded-full text-xs font-medium">
                      Apenas .PDF
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div>
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 h-full">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Status do Documento
              </h2>
              
              {isLoadingStatus ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : pdfStatus?.hasFile ? (
                <div className="space-y-5">
                  <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-success-foreground text-sm">PDF Ativo</p>
                      <p className="text-xs text-success-foreground/80 mt-1 line-clamp-2" title={pdfStatus.filename || ""}>
                        {pdfStatus.filename}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Páginas</p>
                      <p className="font-bold text-foreground text-xl">{pdfStatus.pageCount}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Data</p>
                      <p className="font-bold text-foreground text-sm mt-1">
                        {pdfStatus.uploadedAt ? format(new Date(pdfStatus.uploadedAt), "dd/MM/yy", { locale: ptBR }) : "--"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                  <ShieldAlert className="w-10 h-10 text-muted-foreground mb-3 opacity-20" />
                  <p className="text-sm font-medium text-foreground">Nenhum PDF na base</p>
                  <p className="text-xs text-muted-foreground mt-1">Faça o upload de um diário oficial para começar.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Varredura de Nomes</h3>
              <p className="text-xs text-muted-foreground">Cruze os usuários com o PDF ativo</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleVerify}
              disabled={!pdfStatus?.hasFile || isVerifying || isLoadingResults}
              className="px-5 py-2.5 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Verificar Nomes
            </button>
            <button
              onClick={() => notifyMutation.mutate()}
              disabled={!resultsData?.hasPdf || notifyMutation.isPending || !resultsData.results.some(r => r.found)}
              className="px-5 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2"
            >
              {notifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Enviar Notificações
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Resultados da Última Verificação</h3>
            {resultsData?.checkedAt && (
              <span className="text-xs text-muted-foreground">
                Última checagem: {format(new Date(resultsData.checkedAt), "dd/MM HH:mm", { locale: ptBR })}
              </span>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nome Monitorado</th>
                  <th className="px-6 py-4 font-semibold">E-mail</th>
                  <th className="px-6 py-4 font-semibold hidden md:table-cell">Concurso</th>
                  <th className="px-6 py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingResults ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                    </td>
                  </tr>
                ) : !resultsData?.results || resultsData.results.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhum resultado encontrado. Realize a verificação primeiro.
                    </td>
                  </tr>
                ) : (
                  resultsData.results.map((result) => (
                    <tr key={result.userId} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{result.nome}</td>
                      <td className="px-6 py-4 text-muted-foreground">{result.email}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">{result.concurso || "-"}</td>
                      <td className="px-6 py-4 text-right">
                        {result.found ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success/15 text-success border border-success/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ENCONTRADO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Não localizado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUploadPdf,
  useGetPdfStatus,
  useGetResults,
  useRunCheck,
  useSendNotifications,
  useListUsers,
  useDeleteUser,
  useListConvocacoes,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  UploadCloud, FileText, CheckCircle2,
  Search, Mail, AlertCircle, Loader2,
  FileCheck, ShieldAlert, Users, Trash2, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLANO_LABELS: Record<string, string> = {
  basic: "Basic",
  pro: "Pro",
  premium: "Premium",
};

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pdfStatus, isLoading: isLoadingStatus } = useGetPdfStatus();
  const { data: resultsData, isLoading: isLoadingResults } = useGetResults();
  const { data: usersData, isLoading: isLoadingUsers } = useListUsers();
  const { data: convocacoesData, isLoading: isLoadingConvocacoes } = useListConvocacoes();

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
      },
    },
  });

  const runCheckMutation = useRunCheck({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["/api/results"] });
        queryClient.invalidateQueries({ queryKey: ["/api/convocacoes"] });
        const found = data.results.filter((r) => r.found).length;
        toast({
          title: "Verificação Concluída",
          description: `${found} nome(s) encontrado(s) e salvos em convocações.`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro na verificação",
          description: error?.response?.data?.error || "Falha ao verificar nomes.",
          variant: "destructive",
        });
      },
    },
  });

  const notifyMutation = useSendNotifications({
    mutation: {
      onSuccess: (data) => {
        toast({
          title: "Notificações Enviadas",
          description: `${data.sent} e-mail(s) enviado(s). ${data.failed > 0 ? `${data.failed} falha(s).` : ""}`,
        });
      },
      onError: () => {
        toast({ title: "Erro no envio", variant: "destructive" });
      },
    },
  });

  const deleteUserMutation = useDeleteUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        toast({ title: "Usuário removido com sucesso." });
      },
      onError: () => {
        toast({ title: "Erro ao remover usuário", variant: "destructive" });
      },
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.type !== "application/pdf") {
          toast({ title: "Arquivo inválido", description: "Por favor, envie apenas arquivos PDF.", variant: "destructive" });
          return;
        }
        uploadMutation.mutate({ data: { pdf: file } });
      }
    },
    [uploadMutation, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: uploadMutation.isPending,
  });

  return (
    <div className="flex-1 w-full bg-muted/30">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground tracking-tight">Painel de Administração</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg">Gerencie publicações, convocações e usuários</p>
        </div>

        {/* ── SECTION 1: Upload PDF ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <UploadCloud className="w-5 h-5" />
                </div>
                Upload do Diário Oficial
              </h2>

              <div
                {...getRootProps()}
                className={cn(
                  "flex-1 min-h-[220px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer",
                  isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-border hover:border-primary/50 hover:bg-muted/50",
                  uploadMutation.isPending && "opacity-50 cursor-wait pointer-events-none"
                )}
              >
                <input {...getInputProps()} />
                {uploadMutation.isPending ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="font-bold text-foreground text-lg">Processando PDF...</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Isso pode levar alguns segundos.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-5 text-muted-foreground shadow-sm">
                      <FileText className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-foreground text-lg mb-2">
                      {isDragActive ? "Solte o PDF aqui..." : "Arraste e solte o PDF do Diário"}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mb-5">ou clique para selecionar do seu computador</p>
                    <span className="px-4 py-1.5 bg-background border border-border shadow-sm rounded-full text-xs font-bold tracking-wide">
                      Apenas .PDF
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <FileCheck className="w-5 h-5" />
                </div>
                Status do Documento
              </h2>

              {isLoadingStatus ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : pdfStatus?.hasFile ? (
                <div className="space-y-6">
                  <div className="bg-success/10 border border-success/20 rounded-xl p-5 flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-success-foreground">PDF Ativo</p>
                      <p className="text-sm font-medium text-success-foreground/80 mt-1 line-clamp-2">{pdfStatus.filename}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-5 rounded-xl border border-border">
                      <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Páginas</p>
                      <p className="font-display font-extrabold text-foreground text-3xl">{pdfStatus.pageCount}</p>
                    </div>
                    <div className="bg-muted p-5 rounded-xl border border-border">
                      <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Data</p>
                      <p className="font-display font-extrabold text-foreground text-xl mt-1">
                        {pdfStatus.uploadedAt ? format(new Date(pdfStatus.uploadedAt), "dd/MM", { locale: ptBR }) : "--"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center px-4 bg-muted/50 rounded-xl border border-dashed border-border">
                  <ShieldAlert className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
                  <p className="font-bold text-foreground">Nenhum PDF na base</p>
                  <p className="text-sm font-medium text-muted-foreground mt-2">Faça o upload para começar.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-10 flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-xl">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-xl tracking-tight">Varredura de Nomes</h3>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">Cruza usuários com o PDF e salva convocações encontradas</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => runCheckMutation.mutate()}
              disabled={!pdfStatus?.hasFile || runCheckMutation.isPending}
              className="px-6 py-3.5 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2.5"
            >
              {runCheckMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Verificar Nomes
            </button>
            <button
              onClick={() => notifyMutation.mutate()}
              disabled={!resultsData?.hasPdf || notifyMutation.isPending || !resultsData?.results.some((r) => r.found)}
              className="px-6 py-3.5 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2.5"
            >
              {notifyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
              Enviar Notificações
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-10">
          <div className="px-6 py-6 border-b border-border bg-muted/30 flex justify-between items-center">
            <h3 className="font-bold text-foreground text-lg">Resultados da Última Verificação</h3>
            {resultsData?.checkedAt && (
              <span className="text-sm font-bold text-muted-foreground bg-background px-4 py-1.5 rounded-full border border-border shadow-sm">
                {format(new Date(resultsData.checkedAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Nome Monitorado</th>
                  <th className="px-6 py-4 font-bold tracking-wider">E-mail</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Status no PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingResults ? (
                  <tr><td colSpan={3} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-bold">Carregando resultados...</p>
                  </td></tr>
                ) : !resultsData?.results?.length ? (
                  <tr><td colSpan={3} className="px-6 py-16 text-center">
                    <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground font-bold mb-1">Nenhum resultado ainda</p>
                    <p className="text-muted-foreground font-medium text-sm">Carregue um PDF e clique em "Verificar Nomes".</p>
                  </td></tr>
                ) : (
                  resultsData.results.map((result) => (
                    <tr key={result.userId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-5 font-bold text-foreground">{result.nome}</td>
                      <td className="px-6 py-5 text-muted-foreground font-medium">{result.email}</td>
                      <td className="px-6 py-5 text-right">
                        {result.found ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-success/15 text-success border border-success/30">
                            <CheckCircle2 className="w-4 h-4" /> ENCONTRADO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
                            <AlertCircle className="w-4 h-4" /> Não localizado
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

        {/* ── SECTION 2: Usuários ── */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-10">
          <div className="px-6 py-6 border-b border-border bg-muted/30 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg">Usuários</h3>
            <span className="ml-2 bg-primary/10 text-primary text-xs font-extrabold px-3 py-1 rounded-full border border-primary/20">
              {usersData?.users?.length ?? 0}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Nome</th>
                  <th className="px-6 py-4 font-bold tracking-wider">E-mail</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Plano</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingUsers ? (
                  <tr><td colSpan={5} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-bold">Carregando usuários...</p>
                  </td></tr>
                ) : !usersData?.users?.length ? (
                  <tr><td colSpan={5} className="px-6 py-16 text-center">
                    <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground font-bold mb-1">Nenhum usuário cadastrado</p>
                    <p className="text-muted-foreground font-medium text-sm">Usuários cadastrados na aba "Monitorei" aparecerão aqui.</p>
                  </td></tr>
                ) : (
                  usersData.users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-5 font-bold text-foreground">{user.nome}</td>
                      <td className="px-6 py-5 text-muted-foreground font-medium">{user.email}</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold bg-secondary text-secondary-foreground border border-border shadow-sm">
                          {PLANO_LABELS[user.plano] ?? user.plano}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold bg-success/15 text-success">
                          <span className="w-2 h-2 rounded-full bg-success"></span>
                          Ativo
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm("Tem certeza que deseja remover este usuário?")) {
                              deleteUserMutation.mutate({ id: user.id });
                            }
                          }}
                          disabled={deleteUserMutation.isPending}
                          className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                          title="Remover usuário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── SECTION 3: Convocações ── */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-6 border-b border-border bg-muted/30 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg">Convocações</h3>
            <span className="ml-2 bg-primary/10 text-primary text-xs font-extrabold px-3 py-1 rounded-full border border-primary/20">
              {convocacoesData?.convocacoes?.length ?? 0}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Nome</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Concurso</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingConvocacoes ? (
                  <tr><td colSpan={3} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-bold">Carregando convocações...</p>
                  </td></tr>
                ) : !convocacoesData?.convocacoes?.length ? (
                  <tr><td colSpan={3} className="px-6 py-16 text-center">
                    <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground font-bold mb-1">Nenhuma convocação registrada</p>
                    <p className="text-muted-foreground font-medium text-sm">As convocações aparecem aqui após a verificação de nomes.</p>
                  </td></tr>
                ) : (
                  convocacoesData.convocacoes.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-5 font-bold text-foreground">{c.nome}</td>
                      <td className="px-6 py-5 text-muted-foreground font-medium">{c.concursoNome}</td>
                      <td className="px-6 py-5 text-muted-foreground font-medium">
                        {c.data ? format(new Date(c.data + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR }) : "-"}
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

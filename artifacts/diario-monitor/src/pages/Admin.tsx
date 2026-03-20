import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUploadPdf, useGetPdfStatus, useGetResults, useRunCheck,
  useSendNotifications, useListUsers, useDeleteUser, useListConvocacoes,
  useListCidades,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  UploadCloud, FileText, CheckCircle2, Search, Mail, AlertCircle, Loader2,
  FileCheck, ShieldAlert, Users, Trash2, Bell, MapPin, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminTab = "upload" | "usuarios" | "convocacoes";

const PLANO_LABELS: Record<string, string> = { basic: "Basic", pro: "Pro", premium: "Premium" };
const PLANO_COLORS: Record<string, string> = {
  basic: "bg-secondary text-secondary-foreground",
  pro: "bg-blue-50 text-blue-700",
  premium: "bg-amber-50 text-amber-700",
};
const FREQ_LABELS: Record<string, string> = { semanal: "Semanal", mensal: "Mensal" };

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adminTab, setAdminTab] = useState<AdminTab>("upload");
  const [selectedCidadeId, setSelectedCidadeId] = useState(1);

  const { data: pdfStatus, isLoading: isLoadingStatus } = useGetPdfStatus();
  const { data: resultsData, isLoading: isLoadingResults } = useGetResults();
  const { data: usersData, isLoading: isLoadingUsers } = useListUsers();
  const { data: convocacoesData, isLoading: isLoadingConvocacoes } = useListConvocacoes();
  const { data: cidadesData } = useListCidades();

  const cidades = cidadesData?.cidades ?? [];

  const uploadMutation = useUploadPdf({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["/api/pdf/status"] });
        queryClient.invalidateQueries({ queryKey: ["/api/results"] });
        toast({ title: "PDF Processado!", description: `${data.pageCount} páginas lidas de ${data.filename}.` });
      },
      onError: (error: any) => {
        toast({ title: "Falha no Upload", description: error?.response?.data?.error || "Não foi possível processar o PDF.", variant: "destructive" });
      },
    },
  });

  const runCheckMutation = useRunCheck({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["/api/results"] });
        queryClient.invalidateQueries({ queryKey: ["/api/convocacoes"] });
        const found = data.results.filter((r) => r.found).length;
        toast({ title: "Verificação concluída!", description: `${found} nome(s) encontrado(s) e registrado(s) em convocações.` });
      },
      onError: (error: any) => {
        toast({ title: "Erro na verificação", description: error?.response?.data?.error || "Falha ao verificar nomes.", variant: "destructive" });
      },
    },
  });

  const notifyMutation = useSendNotifications({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Notificações enviadas", description: `${data.sent} e-mail(s) enviado(s). ${data.failed > 0 ? `${data.failed} falha(s).` : ""}` });
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
      if (!file) return;
      if (file.type !== "application/pdf") {
        toast({ title: "Arquivo inválido", description: "Por favor, envie apenas arquivos PDF.", variant: "destructive" });
        return;
      }
      uploadMutation.mutate({ data: { pdf: file } });
    },
    [uploadMutation, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: uploadMutation.isPending,
  });

  const ADMIN_TABS: { id: AdminTab; label: string; count?: number }[] = [
    { id: "upload", label: "Upload PDF" },
    { id: "usuarios", label: "Usuários", count: usersData?.users?.length },
    { id: "convocacoes", label: "Convocações", count: convocacoesData?.convocacoes?.length },
  ];

  return (
    <div className="flex-1 w-full bg-muted/30">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground tracking-tight">Administração</h1>
          <p className="text-muted-foreground mt-2 font-medium">Gerencie PDFs, usuários e convocações</p>
        </div>

        {/* Sub-tab navigation */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
          <div className="border-b border-border flex">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex-1 py-4 text-sm font-bold transition-all flex items-center justify-center gap-2
                  ${adminTab === tab.id
                    ? "border-b-2 border-primary text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold
                    ${adminTab === tab.id ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── SUBTAB: UPLOAD PDF ── */}
          {adminTab === "upload" && (
            <div className="p-6 md:p-8">
              {/* Cidade selector */}
              <div className="mb-6 max-w-sm">
                <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Cidade
                </label>
                <div className="relative">
                  <select
                    value={selectedCidadeId}
                    onChange={(e) => setSelectedCidadeId(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none pr-10"
                  >
                    {cidades.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                    {cidades.length === 0 && <option value={1}>Guarujá</option>}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Upload zone */}
                <div className="lg:col-span-2">
                  <div
                    {...getRootProps()}
                    className={cn(
                      "min-h-[240px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer",
                      isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
                      uploadMutation.isPending && "opacity-50 cursor-wait pointer-events-none"
                    )}
                  >
                    <input {...getInputProps()} />
                    {uploadMutation.isPending ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="font-bold text-foreground text-lg">Processando PDF...</p>
                        <p className="text-sm font-medium text-muted-foreground mt-1">Aguarde alguns segundos.</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-5 text-muted-foreground">
                          <FileText className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-foreground text-lg mb-2">
                          {isDragActive ? "Solte o PDF aqui..." : "Arraste o PDF do Diário Oficial"}
                        </p>
                        <p className="text-sm font-medium text-muted-foreground mb-5">ou clique para selecionar</p>
                        <span className="px-4 py-1.5 bg-background border border-border rounded-full text-xs font-bold tracking-wide">
                          Apenas .PDF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="bg-muted/30 rounded-xl border border-border p-6">
                  <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-primary" />
                    Status do Documento
                  </h3>
                  {isLoadingStatus ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                  ) : pdfStatus?.hasFile ? (
                    <div className="space-y-4">
                      <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-success text-sm">PDF Ativo</p>
                          <p className="text-xs text-success/80 mt-0.5 line-clamp-2">{pdfStatus.filename}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background p-4 rounded-xl border border-border text-center">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Páginas</p>
                          <p className="font-display font-extrabold text-foreground text-2xl">{pdfStatus.pageCount}</p>
                        </div>
                        <div className="bg-background p-4 rounded-xl border border-border text-center">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Data</p>
                          <p className="font-display font-extrabold text-foreground text-lg">
                            {pdfStatus.uploadedAt ? format(new Date(pdfStatus.uploadedAt), "dd/MM", { locale: ptBR }) : "--"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center py-8">
                      <ShieldAlert className="w-10 h-10 text-muted-foreground/30 mb-3" />
                      <p className="font-bold text-foreground text-sm">Nenhum PDF carregado</p>
                      <p className="text-xs text-muted-foreground mt-1">Faça o upload para começar.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action bar */}
              <div className="bg-muted/30 rounded-xl border border-border p-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Processar PDF</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Extrai nomes e salva convocações encontradas</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => runCheckMutation.mutate()}
                    disabled={!pdfStatus?.hasFile || runCheckMutation.isPending}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {runCheckMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Verificar Nomes
                  </button>
                  <button
                    onClick={() => notifyMutation.mutate()}
                    disabled={!resultsData?.hasPdf || notifyMutation.isPending || !resultsData?.results.some((r) => r.found)}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    {notifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Notificar
                  </button>
                </div>
              </div>

              {/* Results mini-table */}
              {resultsData?.results && resultsData.results.length > 0 && (
                <div className="mt-6 border border-border rounded-xl overflow-hidden">
                  <div className="px-5 py-4 bg-muted/30 border-b border-border flex justify-between items-center">
                    <p className="font-bold text-foreground text-sm">Resultado da última verificação</p>
                    {resultsData.checkedAt && (
                      <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border border-border">
                        {format(new Date(resultsData.checkedAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-border max-h-64 overflow-y-auto">
                    {resultsData.results.map((r) => (
                      <div key={r.userId} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-bold text-foreground">{r.nome}</p>
                          <p className="text-xs text-muted-foreground">{r.email}</p>
                        </div>
                        {r.found ? (
                          <span className="text-xs font-extrabold text-success flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Encontrado
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Não localizado
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SUBTAB: USUÁRIOS ── */}
          {adminTab === "usuarios" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Nome</th>
                    <th className="px-6 py-4 font-bold tracking-wider">E-mail</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Plano</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Cidade</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Frequência</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingUsers ? (
                    <tr><td colSpan={7} className="px-6 py-14 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground font-bold">Carregando usuários...</p>
                    </td></tr>
                  ) : !usersData?.users?.length ? (
                    <tr><td colSpan={7} className="px-6 py-14 text-center">
                      <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-foreground font-bold mb-1">Nenhum usuário cadastrado</p>
                      <p className="text-muted-foreground font-medium text-sm">Usuários cadastrados na aba "Monitorei" aparecerão aqui.</p>
                    </td></tr>
                  ) : (
                    usersData.users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4 font-bold text-foreground">{user.nome}</td>
                        <td className="px-6 py-4 text-muted-foreground font-medium text-xs">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${PLANO_COLORS[user.plano] ?? "bg-secondary text-secondary-foreground"}`}>
                            {PLANO_LABELS[user.plano] ?? user.plano}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium text-sm">{user.cidadeNome ?? "—"}</td>
                        <td className="px-6 py-4 text-muted-foreground font-medium text-sm">{FREQ_LABELS[user.frequencia] ?? user.frequencia}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-success/15 text-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                            Ativo
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm("Tem certeza que deseja remover este usuário?")) {
                                deleteUserMutation.mutate({ id: user.id });
                              }
                            }}
                            disabled={deleteUserMutation.isPending}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
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
          )}

          {/* ── SUBTAB: CONVOCAÇÕES ── */}
          {adminTab === "convocacoes" && (
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
                    <tr><td colSpan={3} className="px-6 py-14 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground font-bold">Carregando convocações...</p>
                    </td></tr>
                  ) : !convocacoesData?.convocacoes?.length ? (
                    <tr><td colSpan={3} className="px-6 py-14 text-center">
                      <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-foreground font-bold mb-1">Nenhuma convocação registrada</p>
                      <p className="text-muted-foreground font-medium text-sm">As convocações aparecem após a verificação de nomes no PDF.</p>
                    </td></tr>
                  ) : (
                    convocacoesData.convocacoes.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-foreground">{c.nome}</td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">{c.concursoNome}</td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">
                          {c.data ? format(new Date(c.data + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

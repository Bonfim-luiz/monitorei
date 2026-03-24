"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Trash2, FileText, AlertCircle } from "lucide-react";

interface Convocation {
  id: string;
  name: string;
  classification?: string;
  source?: string;
  extractedAt: string;
}

interface ConvocationsListProps {
  onUpdate?: () => void;
}

export function ConvocationsList({ onUpdate }: ConvocationsListProps) {
  const [convocations, setConvocations] = useState<Convocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConvocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/convocations");
      if (!response.ok) throw new Error("Failed to fetch convocations");
      const data = await response.json();
      setConvocations(data);
    } catch (err) {
      setError("Erro ao carregar convocacoes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvocations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta convocacao?")) return;

    try {
      const response = await fetch(`/api/convocations?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete convocation");

      await fetchConvocations();
      onUpdate?.();
    } catch (err) {
      setError("Erro ao excluir convocacao");
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Tem certeza que deseja limpar TODAS as convocacoes?")) return;

    try {
      const response = await fetch("/api/convocations", {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Failed to clear convocations");

      await fetchConvocations();
      onUpdate?.();
    } catch (err) {
      setError("Erro ao limpar convocacoes");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Convocacoes Extraidas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Nomes extraidos dos PDFs do Diario Oficial
          </p>
        </div>
        <div className="flex gap-2">
          {convocations.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Tudo
            </button>
          )}
          <button
            onClick={fetchConvocations}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-3 bg-secondary/50 border-b border-border">
          <span className="text-sm font-medium text-foreground">
            {convocations.length} convocacao(oes) encontrada(s)
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            Carregando...
          </div>
        ) : convocations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Nenhuma convocacao encontrada
            <p className="text-xs mt-1">Faca upload de um PDF para extrair convocacoes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-2 text-sm font-medium text-muted-foreground">
                    Class.
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-muted-foreground">
                    Nome
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-muted-foreground">
                    Fonte
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-muted-foreground">
                    Data
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {convocations.map((conv) => (
                  <tr key={conv.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-2 text-sm text-foreground">
                      {conv.classification || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-foreground">
                      {conv.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">
                      {conv.source || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">
                      {new Date(conv.extractedAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-2">
                      <button
                        onClick={() => handleDelete(conv.id)}
                        className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Convocation } from "@/lib/types";

interface ConvocationSectionProps {
  convocations: Convocation[];
  onConvocationDeleted: () => void;
}

export function ConvocationSection({ convocations, onConvocationDeleted }: ConvocationSectionProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/convocations?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete convocation");
      }

      onConvocationDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting convocation");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Tem certeza que deseja limpar todas as convocações?")) return;

    setIsClearing(true);
    setError(null);

    try {
      const res = await fetch("/api/convocations?all=true", { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to clear convocations");
      }

      onConvocationDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error clearing convocations");
    } finally {
      setIsClearing(false);
    }
  };

  // Group convocations by source
  const groupedConvocations = convocations.reduce((acc, conv) => {
    const source = conv.source || "unknown";
    if (!acc[source]) acc[source] = [];
    acc[source].push(conv);
    return acc;
  }, {} as Record<string, Convocation[]>);

  return (
    <div className="space-y-6">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Convocações Extraídas ({convocations.length})</h2>
        {convocations.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={isClearing}
            className="px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded-md disabled:opacity-50"
          >
            {isClearing ? "Limpando..." : "Limpar Todas"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {convocations.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
          Nenhuma convocação extraída ainda. Faça upload de um PDF na aba Upload.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedConvocations).map(([source, items]) => (
            <div key={source} className="bg-card rounded-lg border border-border">
              <div className="p-4 border-b border-border bg-muted/50">
                <h3 className="font-medium">Fonte: {source}</h3>
                <p className="text-sm text-muted-foreground">{items.length} convocados</p>
              </div>
              <div className="divide-y divide-border">
                {items.map((conv) => (
                  <div key={conv.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        <span className="text-muted-foreground mr-2">#{conv.classification}</span>
                        {conv.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Extraído em: {new Date(conv.extractedAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(conv.id)}
                      disabled={deletingId === conv.id}
                      className="px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded-md disabled:opacity-50"
                    >
                      {deletingId === conv.id ? "..." : "Remover"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

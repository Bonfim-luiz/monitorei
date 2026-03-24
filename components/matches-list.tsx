"use client";

import { useState, useEffect } from "react";
import { RefreshCw, CheckCircle, AlertTriangle, Users, FileText } from "lucide-react";

interface Match {
  id: string;
  userId: string;
  userName: string;
  convocationId: string;
  convocationName: string;
  classification?: string;
  matchedAt: string;
}

interface MatchStats {
  totalUsers: number;
  totalConvocations: number;
  totalMatches: number;
}

export function MatchesList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/matches");
      if (!response.ok) throw new Error("Failed to fetch matches");
      const data = await response.json();
      setMatches(data.matches);
      setStats(data.stats);
    } catch (err) {
      setError("Erro ao carregar matches");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRecalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to recalculate matches");
      const data = await response.json();
      setMatches(data.matches);
      setStats(data.stats);
    } catch (err) {
      setError("Erro ao recalcular matches");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Matches Encontrados</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Usuarios monitorados encontrados nas convocacoes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRecalculate}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Recalcular
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Usuarios</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Convocacoes</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalConvocations}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Matches</span>
            </div>
            <p className="text-2xl font-bold text-success">{stats.totalMatches}</p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            Buscando matches...
          </div>
        ) : matches.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-warning" />
            <p className="text-foreground font-medium">Nenhum match encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione usuarios e faca upload de PDFs para encontrar matches
            </p>
          </div>
        ) : (
          <div>
            <div className="px-4 py-3 bg-success/10 border-b border-border">
              <span className="text-sm font-medium text-success flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {matches.length} match(es) encontrado(s)!
              </span>
            </div>
            <ul className="divide-y divide-border">
              {matches.map((match) => (
                <li key={match.id} className="p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-lg">
                        {match.userName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Encontrado como: <span className="text-foreground">{match.convocationName}</span>
                      </p>
                      {match.classification && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Classificacao:</span>{" "}
                          <span className="font-medium text-primary">{match.classification}</span>
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">
                      MATCH
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Encontrado em: {new Date(match.matchedAt).toLocaleString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Match } from "@/lib/types";

interface MatchSectionProps {
  matches: Match[];
}

export function MatchSection({ matches }: MatchSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Matches Encontrados ({matches.length})</h2>

      {matches.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
          <p>Nenhum match encontrado ainda.</p>
          <p className="text-sm mt-2">
            Matches aparecem quando um usuário monitorado é encontrado em uma convocação.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div
              key={`${match.user.id}-${match.convocation.id}-${index}`}
              className="bg-card rounded-lg border-2 border-success p-6"
            >
              <div className="flex items-center gap-2 text-success mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-lg">MATCH ENCONTRADO!</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Usuário Monitorado</h4>
                  <p className="font-semibold text-lg">{match.user.name}</p>
                  {match.user.email && (
                    <p className="text-sm text-muted-foreground">{match.user.email}</p>
                  )}
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Convocação</h4>
                  <p className="font-semibold text-lg">
                    <span className="text-primary">#{match.convocation.classification}</span> -{" "}
                    {match.convocation.name}
                  </p>
                  {match.convocation.source && (
                    <p className="text-sm text-muted-foreground">Fonte: {match.convocation.source}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Match identificado em: {new Date(match.matchedAt).toLocaleString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

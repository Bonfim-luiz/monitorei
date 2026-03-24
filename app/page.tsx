"use client";

import { useState, useEffect, useCallback } from "react";
import { UserSection } from "@/components/user-section";
import { ConvocationSection } from "@/components/convocation-section";
import { MatchSection } from "@/components/match-section";
import { UploadSection } from "@/components/upload-section";
import { User, Convocation, Match } from "@/lib/types";

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [convocations, setConvocations] = useState<Convocation[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "convocations" | "matches" | "upload">("users");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const fetchConvocations = useCallback(async () => {
    try {
      const res = await fetch("/api/convocations");
      const data = await res.json();
      setConvocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching convocations:", error);
    }
  }, []);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      setMatches(Array.isArray(data.matches) ? data.matches : []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchConvocations(), fetchMatches()]);
    setLoading(false);
  }, [fetchUsers, fetchConvocations, fetchMatches]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUserCreated = () => {
    fetchUsers();
    fetchMatches();
  };

  const handleUserDeleted = () => {
    fetchUsers();
    fetchMatches();
  };

  const handleUploadComplete = () => {
    fetchConvocations();
    fetchMatches();
  };

  const handleConvocationDeleted = () => {
    fetchConvocations();
    fetchMatches();
  };

  const tabs = [
    { id: "users" as const, label: "Usuários", count: users.length },
    { id: "convocations" as const, label: "Convocações", count: convocations.length },
    { id: "matches" as const, label: "Matches", count: matches.length },
    { id: "upload" as const, label: "Upload PDF" },
  ];

  return (
    <main className="min-h-screen bg-secondary/30">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">Monitorei</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de monitoramento de convocações do Diário Oficial
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-muted rounded-full">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div>
            {activeTab === "users" && (
              <UserSection
                users={users}
                onUserCreated={handleUserCreated}
                onUserDeleted={handleUserDeleted}
              />
            )}
            {activeTab === "convocations" && (
              <ConvocationSection
                convocations={convocations}
                onConvocationDeleted={handleConvocationDeleted}
              />
            )}
            {activeTab === "matches" && <MatchSection matches={matches} />}
            {activeTab === "upload" && (
              <UploadSection onUploadComplete={handleUploadComplete} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

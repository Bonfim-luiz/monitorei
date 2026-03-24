"use client";

import { useState, useEffect, useCallback } from "react";
import { UserManagement } from "@/components/user-management";
import { ConvocationsList } from "@/components/convocations-list";
import { MatchesList } from "@/components/matches-list";
import { PdfUpload } from "@/components/pdf-upload";
import { Users, FileText, CheckCircle, Upload } from "lucide-react";

type TabType = "users" | "upload" | "convocations" | "matches";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const tabs = [
    { id: "users" as TabType, label: "Usuarios", icon: Users },
    { id: "upload" as TabType, label: "Upload PDF", icon: Upload },
    { id: "convocations" as TabType, label: "Convocacoes", icon: FileText },
    { id: "matches" as TabType, label: "Matches", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">Monitorei</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de monitoramento de convocacoes em Diario Oficial
          </p>
        </div>
      </header>

      <nav className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "users" && (
          <UserManagement key={`users-${refreshKey}`} onUpdate={handleRefresh} />
        )}
        {activeTab === "upload" && (
          <PdfUpload key={`upload-${refreshKey}`} onUploadComplete={handleRefresh} />
        )}
        {activeTab === "convocations" && (
          <ConvocationsList key={`convocations-${refreshKey}`} onUpdate={handleRefresh} />
        )}
        {activeTab === "matches" && (
          <MatchesList key={`matches-${refreshKey}`} />
        )}
      </main>
    </div>
  );
}

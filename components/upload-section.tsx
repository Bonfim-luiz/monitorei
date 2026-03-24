"use client";

import { useState, useRef } from "react";

interface UploadSectionProps {
  onUploadComplete: () => void;
}

interface UploadResult {
  success: boolean;
  message: string;
  convocations?: Array<{
    id: string;
    classification: string;
    name: string;
  }>;
  total?: number;
}

export function UploadSection({ onUploadComplete }: UploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.includes("pdf")) {
      setError("Por favor, selecione um arquivo PDF.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      setResult(data);
      onUploadComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Upload de PDF do Diário Oficial</h2>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="text-muted-foreground">Processando PDF...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="font-medium">Arraste e solte um PDF aqui</p>
              <p className="text-sm text-muted-foreground mt-1">
                ou clique para selecionar
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Success Result */}
      {result && result.success && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <h3 className="font-semibold text-success mb-2">Upload Concluído!</h3>
          <p className="text-sm mb-4">{result.message}</p>
          
          {result.convocations && result.convocations.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Convocados Extraídos:</h4>
              <div className="max-h-60 overflow-y-auto bg-card rounded-lg border border-border">
                {result.convocations.map((conv) => (
                  <div key={conv.id} className="px-4 py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">#{conv.classification}</span>{" "}
                    <span className="font-medium">{conv.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">Como funciona:</h3>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Faça upload de um PDF do Diário Oficial</li>
          <li>O sistema extrai automaticamente os nomes convocados</li>
          <li>Os nomes são comparados com os usuários monitorados</li>
          <li>Matches são exibidos na aba correspondente</li>
        </ol>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

interface PdfUploadProps {
  onUploadComplete?: () => void;
}

interface UploadResult {
  success: boolean;
  extracted: number;
  total: number;
  names: string[];
}

export function PdfUpload({ onUploadComplete }: PdfUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Por favor, selecione um arquivo PDF");
      return;
    }
    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setResult(data);
      onUploadComplete?.();
    } catch (err) {
      setError("Erro ao fazer upload do arquivo");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Upload de PDF</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Faca upload de um PDF do Diario Oficial para extrair nomes de convocacoes
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-10 h-10 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={clearFile}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {uploading ? "Processando..." : "Processar PDF"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-foreground font-medium">
                Arraste e solte um arquivo PDF aqui
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ou clique para selecionar
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              Selecionar Arquivo
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-3 bg-success/10 border-b border-border flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="font-medium text-foreground">Upload concluido com sucesso!</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-secondary/50 rounded-md p-3">
                <p className="text-muted-foreground">Nomes extraidos</p>
                <p className="text-2xl font-bold text-foreground">{result.extracted}</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-3">
                <p className="text-muted-foreground">Total de convocacoes</p>
                <p className="text-2xl font-bold text-foreground">{result.total}</p>
              </div>
            </div>
            {result.names.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Nomes adicionados:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                  {result.names.map((name, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

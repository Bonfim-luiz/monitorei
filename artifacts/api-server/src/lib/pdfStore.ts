import path from "path";
import fs from "fs";

// In-memory store for PDF state (sufficient for single-server MVP)
interface PdfState {
  filename: string | null;
  uploadedAt: Date | null;
  pageCount: number | null;
  filePath: string | null;
}

const state: PdfState = {
  filename: null,
  uploadedAt: null,
  pageCount: null,
  filePath: null,
};

export const DATA_DIR = path.resolve(process.cwd(), "artifacts", "api-server", "data");

export function setPdfState(filename: string, filePath: string, pageCount: number) {
  state.filename = filename;
  state.filePath = filePath;
  state.pageCount = pageCount;
  state.uploadedAt = new Date();
}

export function getPdfState() {
  return { ...state };
}

export function clearPdfState() {
  state.filename = null;
  state.filePath = null;
  state.pageCount = null;
  state.uploadedAt = null;
}

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

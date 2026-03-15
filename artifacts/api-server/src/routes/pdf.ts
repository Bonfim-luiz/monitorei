import { Router, type IRouter } from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ numpages: number; text: string }>;
import { GetPdfStatusResponse, UploadPdfResponse } from "@workspace/api-zod";
import { setPdfState, getPdfState, ensureDataDir, DATA_DIR } from "../lib/pdfStore.js";

const router: IRouter = Router();

// Configure multer to save uploaded PDFs to the data directory
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDataDir();
    cb(null, DATA_DIR);
  },
  filename: (_req, file, cb) => {
    // Use a fixed filename so it's easy to reference
    cb(null, "diario.pdf");
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos PDF são aceitos."));
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Upload a Diário Oficial PDF
router.post("/pdf/upload", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Nenhum arquivo PDF enviado." });
    return;
  }

  try {
    // Parse the PDF to count pages and validate it
    const { default: fs } = await import("fs");
    const buffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(buffer);

    setPdfState(req.file.originalname, req.file.path, data.numpages);

    const response = UploadPdfResponse.parse({
      success: true,
      filename: req.file.originalname,
      pageCount: data.numpages,
      message: `PDF carregado com sucesso. ${data.numpages} página(s) encontrada(s).`,
    });

    res.json(response);
  } catch (err) {
    console.error("Error processing PDF:", err);
    res.status(500).json({ error: "Erro ao processar o arquivo PDF." });
  }
});

// Get current PDF status
router.get("/pdf/status", (_req, res) => {
  const state = getPdfState();

  const response = GetPdfStatusResponse.parse({
    hasFile: state.filename !== null,
    filename: state.filename,
    uploadedAt: state.uploadedAt?.toISOString() ?? null,
    pageCount: state.pageCount,
  });

  res.json(response);
});

export default router;

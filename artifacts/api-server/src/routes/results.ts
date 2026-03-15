import { Router, type IRouter } from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
type PdfData = { numpages: number; text: string };
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<PdfData>;
import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { getPdfState } from "../lib/pdfStore.js";
import fs from "fs";

const router: IRouter = Router();

type CheckResult = {
  userId: number;
  nome: string;
  email: string;
  concurso: string | null;
  found: boolean;
};

// Extract text from current PDF and check each user's name against it
async function extractAndCheck(): Promise<CheckResult[]> {
  const state = getPdfState();
  if (!state.filePath) return [];

  const buffer = fs.readFileSync(state.filePath);
  const data = await pdfParse(buffer);
  const textUpper = data.text.toUpperCase();

  const users = await db.select().from(usersTable);

  return users.map((user) => ({
    userId: user.id,
    nome: user.nome,
    email: user.email,
    concurso: user.concurso ?? null,
    found: textUpper.includes(user.nome.toUpperCase()),
  }));
}

// Keep last check results in memory
let lastResults: CheckResult[] = [];
let checkedAt: string | null = null;

// Get current results (auto-check if PDF is available and results are empty)
router.get("/results", async (_req, res) => {
  try {
    const state = getPdfState();

    if (state.filePath && lastResults.length === 0) {
      lastResults = await extractAndCheck();
      checkedAt = new Date().toISOString();
    }

    res.json({
      results: lastResults,
      checkedAt,
      hasPdf: state.filePath !== null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error getting results:", msg);
    res.status(500).json({ error: "Erro ao buscar resultados." });
  }
});

// Manually trigger a fresh check against the current PDF
router.post("/results/check", async (_req, res) => {
  try {
    const state = getPdfState();
    if (!state.filePath) {
      res.status(400).json({ error: "Nenhum PDF carregado. Faça o upload primeiro." });
      return;
    }

    lastResults = await extractAndCheck();
    checkedAt = new Date().toISOString();

    res.json({
      results: lastResults,
      checkedAt,
      hasPdf: true,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error running check:", msg);
    res.status(500).json({ error: "Erro ao verificar convocações." });
  }
});

// Send email notifications to all users based on last check
router.post("/results/notify", async (_req, res) => {
  try {
    if (lastResults.length === 0) {
      res.status(400).json({ error: "Execute a verificação antes de enviar notificações." });
      return;
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      res.status(500).json({
        error: "Credenciais de email não configuradas. Defina EMAIL_USER e EMAIL_PASS nas variáveis de ambiente.",
      });
      return;
    }

    // Configure Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: emailUser, pass: emailPass },
    });

    let sent = 0;
    let failed = 0;

    for (const result of lastResults) {
      const concursoInfo = result.concurso ? ` (${result.concurso})` : "";
      const message = result.found
        ? `Olá, ${result.nome}!\n\nSeu nome foi encontrado na convocação do Diário Oficial de hoje${concursoInfo}.\n\nAcesse o portal para mais detalhes.\n\nMonitor de Convocações`
        : `Olá, ${result.nome}!\n\nSeu nome não apareceu nas convocações do Diário Oficial de hoje${concursoInfo}.\n\nContinue acompanhando.\n\nMonitor de Convocações`;

      try {
        await transporter.sendMail({
          from: `"Monitor de Convocações" <${emailUser}>`,
          to: result.email,
          subject: "Monitor de Convocações – Resultado do Dia",
          text: message,
        });
        sent++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Failed to send email to ${result.email}:`, msg);
        failed++;
      }
    }

    res.json({
      sent,
      failed,
      message: `${sent} email(s) enviado(s) com sucesso.${failed > 0 ? ` ${failed} falha(s).` : ""}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error sending notifications:", msg);
    res.status(500).json({ error: "Erro ao enviar notificações." });
  }
});

export default router;

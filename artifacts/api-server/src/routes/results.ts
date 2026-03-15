import { Router, type IRouter } from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ numpages: number; text: string }>;
import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { GetResultsResponse, SendNotificationsResponse } from "@workspace/api-zod";
import { getPdfState } from "../lib/pdfStore.js";

const router: IRouter = Router();

// Extract and check names against the current PDF
async function extractAndCheck(): Promise<{ found: boolean; nome: string; userId: number; email: string; concurso: string | null }[]> {
  const state = getPdfState();
  if (!state.filePath) {
    return [];
  }

  const { default: fs } = await import("fs");
  const buffer = fs.readFileSync(state.filePath);
  const data = await pdfParse(buffer);
  const textUpper = data.text.toUpperCase();

  const users = await db.select().from(usersTable);

  return users.map((user) => ({
    userId: user.id,
    nome: user.nome,
    email: user.email,
    concurso: user.concurso,
    found: textUpper.includes(user.nome.toUpperCase()),
  }));
}

// Store the last check results in memory
let lastResults: Awaited<ReturnType<typeof extractAndCheck>> = [];
let checkedAt: Date | null = null;

// Get current results (run check if PDF is available)
router.get("/results", async (_req, res) => {
  try {
    const state = getPdfState();

    if (state.filePath && lastResults.length === 0) {
      // Auto-run check when PDF is available
      lastResults = await extractAndCheck();
      checkedAt = new Date();
    }

    const response = GetResultsResponse.parse({
      results: lastResults.map((r) => ({
        userId: r.userId,
        nome: r.nome,
        email: r.email,
        concurso: r.concurso,
        found: r.found,
      })),
      checkedAt: checkedAt?.toISOString() ?? null,
      hasPdf: state.filePath !== null,
    });

    res.json(response);
  } catch (err) {
    console.error("Error getting results:", err);
    res.status(500).json({ error: "Erro ao buscar resultados." });
  }
});

// Run manual check and refresh results
router.post("/results/check", async (_req, res) => {
  try {
    const state = getPdfState();
    if (!state.filePath) {
      res.status(400).json({ error: "Nenhum PDF carregado. Faça o upload primeiro." });
      return;
    }

    lastResults = await extractAndCheck();
    checkedAt = new Date();

    const response = GetResultsResponse.parse({
      results: lastResults.map((r) => ({
        userId: r.userId,
        nome: r.nome,
        email: r.email,
        concurso: r.concurso,
        found: r.found,
      })),
      checkedAt: checkedAt.toISOString(),
      hasPdf: true,
    });

    res.json(response);
  } catch (err) {
    console.error("Error running check:", err);
    res.status(500).json({ error: "Erro ao verificar convocações." });
  }
});

// Send email notifications to all users
router.post("/results/notify", async (_req, res) => {
  try {
    if (lastResults.length === 0) {
      res.status(400).json({ error: "Execute a verificação antes de enviar notificações." });
      return;
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      res.status(500).json({ error: "Credenciais de email não configuradas. Defina EMAIL_USER e EMAIL_PASS nas variáveis de ambiente." });
      return;
    }

    // Configure Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    let sent = 0;
    let failed = 0;

    for (const result of lastResults) {
      const message = result.found
        ? `Olá, ${result.nome}!\n\nSeu nome foi encontrado na convocação do Diário Oficial de hoje${result.concurso ? ` (${result.concurso})` : ""}.\n\nAcesse o portal para mais detalhes.\n\nMonitor de Convocações`
        : `Olá, ${result.nome}!\n\nSeu nome não apareceu nas convocações do Diário Oficial de hoje${result.concurso ? ` (${result.concurso})` : ""}.\n\nContinue acompanhando.\n\nMonitor de Convocações`;

      try {
        await transporter.sendMail({
          from: `"Monitor de Convocações" <${emailUser}>`,
          to: result.email,
          subject: "Monitor de Convocações – Resultado do Dia",
          text: message,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send email to ${result.email}:`, err);
        failed++;
      }
    }

    const response = SendNotificationsResponse.parse({
      sent,
      failed,
      message: `${sent} email(s) enviado(s) com sucesso. ${failed} falha(s).`,
    });

    res.json(response);
  } catch (err) {
    console.error("Error sending notifications:", err);
    res.status(500).json({ error: "Erro ao enviar notificações." });
  }
});

export default router;

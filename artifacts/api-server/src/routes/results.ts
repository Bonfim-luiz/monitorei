import { Router, type IRouter } from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
type PdfData = { numpages: number; text: string };
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<PdfData>;
import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { usersTable, convocacoesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getPdfState } from "../lib/pdfStore.js";
import fs from "fs";

const router: IRouter = Router();

type CheckResult = {
  userId: number;
  nome: string;
  email: string;
  found: boolean;
};

async function extractAndCheck(): Promise<{ results: CheckResult[]; foundNames: string[] }> {
  const state = getPdfState();
  if (!state.filePath) return { results: [], foundNames: [] };

  const buffer = fs.readFileSync(state.filePath);
  const data = await pdfParse(buffer);
  const textUpper = data.text.toUpperCase();

  const users = await db.select().from(usersTable);

  const results = users.map((user) => ({
    userId: user.id,
    nome: user.nome,
    email: user.email,
    found: textUpper.includes(user.nome.toUpperCase()),
  }));

  // Collect names found (for saving to convocacoes)
  const foundNames = results.filter((r) => r.found).map((r) => r.nome);

  return { results, foundNames };
}

let lastResults: CheckResult[] = [];
let checkedAt: string | null = null;

router.get("/results", async (_req, res) => {
  try {
    const state = getPdfState();

    if (state.filePath && lastResults.length === 0) {
      const { results } = await extractAndCheck();
      lastResults = results;
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

router.post("/results/check", async (_req, res) => {
  try {
    const state = getPdfState();
    if (!state.filePath) {
      res.status(400).json({ error: "Nenhum PDF carregado. Faça o upload primeiro." });
      return;
    }

    const { results, foundNames } = await extractAndCheck();
    lastResults = results;
    checkedAt = new Date().toISOString();

    // Save all found names to convocacoes table (default concurso_id = 1)
    const today = new Date().toISOString().slice(0, 10);
    if (foundNames.length > 0) {
      // Remove today's entries for this concurso to avoid duplicates, then re-insert
      await db
        .delete(convocacoesTable)
        .where(eq(convocacoesTable.data, today));

      await db.insert(convocacoesTable).values(
        foundNames.map((nome) => ({
          nome,
          concursoId: 1,
          data: today,
        }))
      );
    }

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
        error: "Credenciais de email não configuradas. Defina EMAIL_USER e EMAIL_PASS.",
      });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: emailUser, pass: emailPass },
    });

    let sent = 0;
    let failed = 0;

    for (const result of lastResults) {
      const message = result.found
        ? `Olá, ${result.nome}!\n\nSeu nome foi encontrado na convocação do Diário Oficial de hoje.\n\nAcesse o portal Monitorei para mais detalhes.\n\nMonitorei`
        : `Olá, ${result.nome}!\n\nSeu nome não apareceu nas convocações do Diário Oficial de hoje.\n\nContinue acompanhando.\n\nMonitorei`;

      try {
        await transporter.sendMail({
          from: `"Monitorei" <${emailUser}>`,
          to: result.email,
          subject: "Monitorei – Resultado do Dia",
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

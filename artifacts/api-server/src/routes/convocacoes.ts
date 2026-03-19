import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { convocacoesTable, concursosTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/convocacoes", async (_req, res) => {
  try {
    const convocacoes = await db.select().from(convocacoesTable).orderBy(convocacoesTable.data);
    const concursos = await db.select().from(concursosTable);
    const concursoMap = new Map(concursos.map((c) => [c.id, c.nome]));

    res.json({
      convocacoes: convocacoes.map((c) => ({
        id: c.id,
        nome: c.nome,
        concursoId: c.concursoId,
        concursoNome: concursoMap.get(c.concursoId) ?? "Desconhecido",
        data: c.data,
      })),
    });
  } catch (err) {
    console.error("Error listing convocacoes:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "Erro ao buscar convocações." });
  }
});

export default router;

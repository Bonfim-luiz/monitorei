import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { concursosTable, cidadesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/concursos", async (_req, res) => {
  try {
    const concursos = await db.select().from(concursosTable);
    const cidades = await db.select().from(cidadesTable);
    const cidadeMap = new Map(cidades.map((c) => [c.id, c.nome]));

    res.json({
      concursos: concursos.map((c) => ({
        id: c.id,
        nome: c.nome,
        cidadeId: c.cidadeId,
        cidadeNome: cidadeMap.get(c.cidadeId) ?? "Desconhecida",
      })),
    });
  } catch (err) {
    console.error("Error listing concursos:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "Erro ao buscar concursos." });
  }
});

export default router;

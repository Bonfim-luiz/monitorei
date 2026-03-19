import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cidadesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/cidades", async (_req, res) => {
  try {
    const cidades = await db.select().from(cidadesTable);
    res.json({ cidades });
  } catch (err) {
    console.error("Error listing cidades:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "Erro ao buscar cidades." });
  }
});

export default router;

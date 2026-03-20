import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, concursosTable, cidadesTable, convocacoesTable } from "@workspace/db/schema";
import { eq, sql, inArray } from "drizzle-orm";

const router: IRouter = Router();

function parseIds(raw: string | null | undefined): number[] {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
  } catch {
    return [];
  }
}

router.post("/users", async (req, res) => {
  const { nome, email, plano = "basic", cidadeId = 1, concursoIds = [1], frequencia = "semanal" } = req.body ?? {};

  if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
    res.status(400).json({ error: "Nome inválido. Mínimo 2 caracteres." });
    return;
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Email inválido." });
    return;
  }

  const ids = Array.isArray(concursoIds) ? concursoIds.map(Number) : [1];
  const primaryConcursoId = ids[0] ?? 1;

  try {
    const [user] = await db
      .insert(usersTable)
      .values({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        plano,
        status: "ativo",
        frequencia,
        cidadeId,
        concursoId: primaryConcursoId,
        concursoIds: JSON.stringify(ids),
      })
      .returning();

    const cidade = user.cidadeId
      ? await db.select().from(cidadesTable).where(eq(cidadesTable.id, user.cidadeId)).limit(1)
      : [];

    res.status(201).json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      plano: user.plano,
      status: user.status,
      frequencia: user.frequencia,
      cidadeId: user.cidadeId ?? null,
      cidadeNome: cidade[0]?.nome ?? null,
      concursoId: user.concursoId ?? null,
      concursoIds: parseIds(user.concursoIds),
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === "23505") {
      res.status(409).json({ error: "Este email já está cadastrado." });
    } else {
      console.error("Error registering user:", err instanceof Error ? err.message : String(err));
      res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
    }
  }
});

router.get("/users", async (_req, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(usersTable.id);
    const cidades = await db.select().from(cidadesTable);
    const cidadeMap = new Map(cidades.map((c) => [c.id, c.nome]));

    res.json({
      users: users.map((u) => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        plano: u.plano,
        status: u.status,
        frequencia: u.frequencia,
        cidadeId: u.cidadeId ?? null,
        cidadeNome: u.cidadeId ? (cidadeMap.get(u.cidadeId) ?? null) : null,
        concursoId: u.concursoId ?? null,
        concursoIds: parseIds(u.concursoIds),
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Error listing users:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

router.get("/users/by-email", async (req, res) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email é obrigatório." });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    const ids = parseIds(user.concursoIds);

    const cidade = user.cidadeId
      ? await db.select().from(cidadesTable).where(eq(cidadesTable.id, user.cidadeId)).limit(1)
      : [];

    const concursos = ids.length > 0
      ? await db.select().from(concursosTable).where(inArray(concursosTable.id, ids))
      : [];

    const allCidades = await db.select().from(cidadesTable);
    const cidadeMap = new Map(allCidades.map((c) => [c.id, c.nome]));

    const nomeUpper = user.nome.toUpperCase();

    const concursoStatuses = await Promise.all(
      concursos.map(async (c) => {
        const allConvocacoes = await db
          .select()
          .from(convocacoesTable)
          .where(eq(convocacoesTable.concursoId, c.id));

        const totalConvocados = allConvocacoes.length;

        const convocado = allConvocacoes.some(
          (cv) => cv.nome.toUpperCase().includes(nomeUpper) || nomeUpper.includes(cv.nome.toUpperCase())
        );

        const ultima = allConvocacoes
          .map((cv) => cv.data)
          .filter(Boolean)
          .sort()
          .reverse()[0] ?? null;

        return {
          id: c.id,
          nome: c.nome,
          cidade: cidadeMap.get(c.cidadeId) ?? "Desconhecida",
          convocado,
          totalConvocados,
          ultimaConvocacao: ultima,
        };
      })
    );

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      plano: user.plano,
      status: user.status,
      frequencia: user.frequencia,
      cidadeNome: cidade[0]?.nome ?? null,
      concursos: concursoStatuses,
    });
  } catch (err) {
    console.error("Error getting user profile:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "Erro ao buscar perfil." });
  }
});

router.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "ID inválido." });
    return;
  }

  try {
    const deleted = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }
    res.json({ success: true, message: "Usuário removido com sucesso." });
  } catch (err) {
    console.error("Error deleting user:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "Erro ao remover usuário." });
  }
});

export default router;

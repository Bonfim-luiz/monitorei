import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, concursosTable, cidadesTable, convocacoesTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.post("/users", async (req, res) => {
  const { nome, email, plano = "basic" } = req.body ?? {};

  if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
    res.status(400).json({ error: "Nome inválido. Mínimo 2 caracteres." });
    return;
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Email inválido." });
    return;
  }

  try {
    const [user] = await db
      .insert(usersTable)
      .values({ nome: nome.trim(), email: email.trim().toLowerCase(), plano, status: "ativo", concursoId: 1 })
      .returning();

    res.status(201).json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      plano: user.plano,
      status: user.status,
      concursoId: user.concursoId ?? null,
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
    res.json({
      users: users.map((u) => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        plano: u.plano,
        status: u.status,
        concursoId: u.concursoId ?? null,
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

    let concursoInfo = null;
    let totalConvocados = 0;

    if (user.concursoId) {
      const [concurso] = await db
        .select()
        .from(concursosTable)
        .where(eq(concursosTable.id, user.concursoId))
        .limit(1);

      if (concurso) {
        const [cidade] = await db
          .select()
          .from(cidadesTable)
          .where(eq(cidadesTable.id, concurso.cidadeId))
          .limit(1);

        concursoInfo = {
          id: concurso.id,
          nome: concurso.nome,
          cidade: cidade?.nome ?? "Desconhecida",
        };

        const countResult = await db
          .select({ count: sql<string>`count(*)` })
          .from(convocacoesTable)
          .where(eq(convocacoesTable.concursoId, user.concursoId));

        totalConvocados = parseInt(countResult[0]?.count ?? "0", 10);
      }
    }

    const convocacoes = user.concursoId
      ? await db
          .select({ nome: convocacoesTable.nome })
          .from(convocacoesTable)
          .where(eq(convocacoesTable.concursoId, user.concursoId))
      : [];

    const nomeUpper = user.nome.toUpperCase();
    const convocado = convocacoes.some(
      (c) => c.nome.toUpperCase().includes(nomeUpper) || nomeUpper.includes(c.nome.toUpperCase())
    );

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      plano: user.plano,
      status: user.status,
      concurso: concursoInfo,
      convocado,
      totalConvocados,
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

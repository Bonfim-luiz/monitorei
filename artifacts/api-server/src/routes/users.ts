import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Register a new user for monitoring
router.post("/users", async (req, res) => {
  const { nome, email, frequencia } = req.body ?? {};

  if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
    res.status(400).json({ error: "Nome inválido. Mínimo 2 caracteres." });
    return;
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Email inválido." });
    return;
  }

  const freq = frequencia === "mensal" ? "mensal" : "diario";

  try {
    const [user] = await db
      .insert(usersTable)
      .values({ nome: nome.trim(), email: email.trim().toLowerCase(), frequencia: freq, status: "ativo" })
      .returning();
    res.status(201).json(user);
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

// List all registered users
router.get("/users", async (_req, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
    res.json({ users });
  } catch (err) {
    console.error("Error listing users:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// Remove a user
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

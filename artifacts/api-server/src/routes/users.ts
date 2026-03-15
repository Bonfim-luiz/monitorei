import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { RegisterUserBody, ListUsersResponse, DeleteUserParams, DeleteUserResponse } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Register a new user for monitoring
router.post("/users", async (req, res) => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos. Verifique nome e email." });
    return;
  }

  const { nome, email, concurso } = parsed.data;

  try {
    const [user] = await db
      .insert(usersTable)
      .values({ nome, email, concurso: concurso ?? null })
      .returning();
    res.status(201).json(user);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === "23505") {
      res.status(409).json({ error: "Este email já está cadastrado." });
    } else {
      console.error("Error registering user:", err);
      res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
    }
  }
});

// List all registered users
router.get("/users", async (_req, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
    const response = ListUsersResponse.parse({ users });
    res.json(response);
  } catch (err) {
    console.error("Error listing users:", err);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// Remove a user
router.delete("/users/:id", async (req, res) => {
  const parsed = DeleteUserParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "ID inválido." });
    return;
  }

  try {
    const deleted = await db
      .delete(usersTable)
      .where(eq(usersTable.id, parsed.data.id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    const response = DeleteUserResponse.parse({ success: true, message: "Usuário removido com sucesso." });
    res.json(response);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Erro ao remover usuário." });
  }
});

export default router;

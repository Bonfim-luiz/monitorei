import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("monitored_users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  plano: text("plano").notNull().default("basic"),
  status: text("status").notNull().default("ativo"),
  concursoId: integer("concurso_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MonitoredUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

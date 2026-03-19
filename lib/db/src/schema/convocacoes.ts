import { pgTable, serial, text, integer, date } from "drizzle-orm/pg-core";

export const convocacoesTable = pgTable("convocacoes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  concursoId: integer("concurso_id").notNull(),
  data: date("data").notNull(),
});

export type Convocacao = typeof convocacoesTable.$inferSelect;
export type InsertConvocacao = typeof convocacoesTable.$inferInsert;

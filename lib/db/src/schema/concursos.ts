import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const cidadesTable = pgTable("cidades", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
});

export const concursosTable = pgTable("concursos", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cidadeId: integer("cidade_id").notNull(),
});

export type Cidade = typeof cidadesTable.$inferSelect;
export type Concurso = typeof concursosTable.$inferSelect;

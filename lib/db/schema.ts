import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
} from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables (Monitorei) ------------------------------------------------

// Planos disponíveis (dados globais, não escopados por usuário)
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("priceCents").notNull().default(0),
  // limite de monitoramentos simultâneos; null = ilimitado
  maxMonitors: integer("maxMonitors"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Concursos publicados (dados globais). Populados manualmente ou via upload de PDF.
export const concursos = pgTable("concursos", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  orgao: text("orgao"),
  cidade: text("cidade"),
  estado: text("estado"),
  banca: text("banca"),
  status: text("status").notNull().default("aberto"), // aberto | encerrado | previsto
  dataInscricaoInicio: timestamp("dataInscricaoInicio"),
  dataInscricaoFim: timestamp("dataInscricaoFim"),
  dataProva: timestamp("dataProva"),
  vagas: integer("vagas"),
  fonteUrl: text("fonteUrl"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Monitoramentos criados pelo usuário. Escopados por userId.
export const monitors = pgTable("monitors", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  concursoId: integer("concursoId").notNull(),
  cidade: text("cidade"),
  // frequência de alertas: diaria | semanal | imediata
  alertFrequency: text("alertFrequency").notNull().default("diaria"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Perfil estendido do usuário (plano, cidade padrão). Escopado por userId.
export const profiles = pgTable("profiles", {
  userId: text("userId").primaryKey(),
  planSlug: text("planSlug").notNull().default("gratis"),
  cidade: text("cidade"),
  isAdmin: boolean("isAdmin").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

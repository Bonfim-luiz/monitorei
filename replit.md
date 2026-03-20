# Monitorei

## Overview

SaaS web application to monitor Brazilian Diário Oficial PDFs and notify users when their name appears in convocação lists. Targeting public exam candidates in Guarujá - SP.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Frontend**: React + Vite (artifacts/diario-monitor)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **PDF parsing**: pdf-parse v1 (CJS require via createRequire in ESM context)
- **File upload**: multer
- **Email**: nodemailer (Gmail SMTP)
- **Validation**: Zod, drizzle-zod
- **API codegen**: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)

## App Structure

3-tab navigation: **Monitorei** | **Meu Perfil** | **Administração**

### Tab 1 — Monitorei (Landing)
- Hero section + problem/solution blocks
- 3 pricing cards (Basic R$19,90 / Pro R$29,90 / Premium R$49,90) — click to select
- Signup form: Nome, Email, Cidade (dropdown), Concurso (dropdown), Frequência (Semanal/Mensal)

### Tab 2 — Meu Perfil
- Email dropdown for simulated login
- Sub-tab **Perfil**: nome, email, plano, frequência, cidade
- Sub-tab **Meu Monitoramento**: concurso selector (for Pro/Premium), convocação status, total convocados, última convocação date

### Tab 3 — Administração
- Sub-tab **Upload PDF**: cidade selector, PDF dropzone, "Verificar Nomes" (saves to convocacoes), results mini-table, notify button
- Sub-tab **Usuários**: table with nome, email, plano, cidade, frequência, status, delete action
- Sub-tab **Convocações**: table with nome, concurso, data

## Database Schema

| Table | Columns |
|---|---|
| `monitored_users` | id, nome, email, plano (basic/pro/premium), status, frequencia (semanal/mensal), cidade_id, concurso_id (primary), concurso_ids (JSON array), created_at |
| `cidades` | id, nome |
| `concursos` | id, nome, cidade_id |
| `convocacoes` | id, nome, concurso_id, data |

## Mock Data (seeded)

- 1 cidade: Guarujá
- 6 concursos: Educação 2023, Saúde 2024, Administrativo 2023, Tecnologia 2024, Operações 2024, Jurídico 2023
- 10 users (mix of basic/pro/premium plans, various concurso assignments)
- 23 convocações across 5 concursos (Jurídico has zero intentionally)

## Plan System

| Plan | Concursos | Price |
|---|---|---|
| Basic | 1 | R$19,90/ano |
| Pro | até 3 | R$29,90/ano |
| Premium | ilimitados | R$49,90/ano |

(No payment integration yet — fields only)

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned by Replit)
- `EMAIL_USER` — Gmail address for sending notifications
- `EMAIL_PASS` — Gmail App Password (Google Account > Security > App Passwords)

## Running Codegen

After modifying `lib/api-spec/openapi.yaml`:
```
pnpm --filter @workspace/api-spec run codegen
```

## File Layout

```
artifacts/
  api-server/src/routes/
    users.ts         # CRUD + profile by email (multi-concurso)
    pdf.ts           # Upload & status
    results.ts       # Name matching + save to convocacoes
    concursos.ts     # List concursos with cidade
    cidades.ts       # List cidades
    convocacoes.ts   # List all convocações
  diario-monitor/src/pages/
    Home.tsx         # Marketing landing + pricing + signup form
    Profile.tsx      # Profile with Perfil/Monitoramento sub-tabs
    Admin.tsx        # Admin with Upload/Usuários/Convocações sub-tabs
lib/
  api-spec/openapi.yaml          # API contract
  api-client-react/              # Generated React Query hooks
  db/src/schema/
    users.ts         # monitored_users table
    concursos.ts     # concursos + cidades tables
    convocacoes.ts   # convocacoes table
```

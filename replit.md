# Monitorei

## Overview

SaaS web application to monitor Brazilian Diário Oficial PDFs and notify users when their name appears in convocação lists. Targeting public exam candidates in Guarujá - SP.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/diario-monitor)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **PDF parsing**: pdf-parse (via CJS require in ESM context)
- **File upload**: multer
- **Email**: nodemailer (Gmail SMTP)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   │   ├── src/routes/users.ts        # User CRUD + profile by email
│   │   ├── src/routes/pdf.ts          # PDF upload & status
│   │   ├── src/routes/results.ts      # Name matching & email notifications (saves to convocacoes)
│   │   ├── src/routes/concursos.ts    # List concursos with cidade
│   │   ├── src/routes/cidades.ts      # List cidades
│   │   ├── src/routes/convocacoes.ts  # List all convocações
│   │   ├── src/lib/pdfStore.ts        # In-memory PDF state
│   │   └── data/                      # Uploaded PDFs stored here
│   └── diario-monitor/     # React frontend (3 tabs)
│       ├── src/pages/Home.tsx          # Landing page + signup (plano selection)
│       ├── src/pages/Profile.tsx       # User profile (simulated login via email dropdown)
│       └── src/pages/Admin.tsx         # Admin panel (upload, verify, users, convocações)
├── lib/
│   ├── api-spec/openapi.yaml           # OpenAPI contract
│   ├── api-client-react/               # Generated React Query hooks
│   ├── api-zod/                        # Generated Zod schemas
│   └── db/src/schema/
│       ├── users.ts        # monitored_users table
│       ├── concursos.ts    # concursos + cidades tables
│       └── convocacoes.ts  # convocacoes table
```

## Database Schema

- **monitored_users**: id, nome, email, plano (basic/pro/premium), status, concurso_id, created_at
- **cidades**: id, nome — seeded with Guarujá (id=1)
- **concursos**: id, nome, cidade_id — seeded with "Guarujá Educação 2023" (id=1)
- **convocacoes**: id, nome, concurso_id, data — populated by "Verificar Nomes" in admin

## Plan System

- **basic**: 1 concurso
- **pro**: até 3 concursos
- **premium**: ilimitado
(No payment yet — fields only)

## Features

1. **Landing Page + Signup** (Tab 1 — Monitorei): Users register with nome, email, plano; assigned to concurso_id=1 by default
2. **Profile Page** (Tab 2 — Meu Perfil): Simulated login by email dropdown; shows user info, concurso, convocação status
3. **Admin Panel** (Tab 3 — Administração): Upload PDF, verify names (saves found names to convocacoes table), send email notifications, manage users, view convocações table

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `EMAIL_USER` - Gmail address used to send notifications
- `EMAIL_PASS` - Gmail App Password (generate at Google Account > Security > App Passwords)

## Running Codegen

After modifying `lib/api-spec/openapi.yaml`:
```
pnpm --filter @workspace/api-spec run codegen
```

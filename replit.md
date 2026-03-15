# Monitor de Convocações

## Overview

Full-stack web application to monitor Brazilian Diário Oficial PDFs and notify users when their name appears in convocação lists.

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
│   │   ├── src/routes/users.ts     # User registration CRUD
│   │   ├── src/routes/pdf.ts       # PDF upload & status
│   │   ├── src/routes/results.ts   # Name matching & email notifications
│   │   ├── src/lib/pdfStore.ts     # In-memory PDF state
│   │   └── data/                   # Uploaded PDFs stored here
│   └── diario-monitor/     # React frontend
│       ├── src/pages/Home.tsx      # User registration page
│       └── src/pages/Admin.tsx     # Admin panel (upload PDF, check, notify)
├── lib/
│   ├── api-spec/openapi.yaml       # OpenAPI contract
│   ├── api-client-react/           # Generated React Query hooks
│   ├── api-zod/                    # Generated Zod schemas
│   └── db/src/schema/users.ts      # monitored_users table
```

## Features

1. **Public Registration Page**: Users enter their name, email, and optional concurso to be monitored
2. **Admin Panel** (`/admin`): Upload Diário Oficial PDF, verify names, send email notifications
3. **Email Notifications**: Uses Gmail SMTP via nodemailer (requires EMAIL_USER and EMAIL_PASS env vars)

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `EMAIL_USER` - Gmail address used to send notifications
- `EMAIL_PASS` - Gmail App Password (not regular password - generate at Google Account > Security > App Passwords)

## Running Codegen

After modifying `lib/api-spec/openapi.yaml`:
```
pnpm --filter @workspace/api-spec run codegen
```

## Database Schema

Table `monitored_users`:
- `id` - serial primary key
- `nome` - text (required)
- `email` - text (required, unique)
- `concurso` - text (optional)
- `created_at` - timestamp

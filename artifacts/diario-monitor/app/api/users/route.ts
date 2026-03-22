import { NextRequest, NextResponse } from 'next/server'
import { db } from '@workspace/db'
import { usersTable, cidadesTable } from '@workspace/db/schema'
import { eq } from 'drizzle-orm'

function parseIds(raw: string | null | undefined): number[] {
  try {
    const parsed = JSON.parse(raw ?? '[]')
    return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : []
  } catch {
    return []
  }
}

export async function GET() {
  try {
    const users = await db.select().from(usersTable).orderBy(usersTable.id)
    const cidades = await db.select().from(cidadesTable)
    const cidadeMap = new Map(cidades.map((c) => [c.id, c.nome]))

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        plano: u.plano,
        status: u.status,
        frequencia: u.frequencia,
        cidadeId: u.cidadeId ?? null,
        cidadeNome: u.cidadeId ? (cidadeMap.get(u.cidadeId) ?? null) : null,
        concursoId: u.concursoId ?? null,
        concursoIds: parseIds(u.concursoIds),
        createdAt: u.createdAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error('Error listing users:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Erro ao buscar usuários.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, plano = 'basic', cidadeId = 1, concursoIds = [1], frequencia = 'semanal' } = body ?? {}

    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      return NextResponse.json({ error: 'Nome inválido. Mínimo 2 caracteres.' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    const ids = Array.isArray(concursoIds) ? concursoIds.map(Number) : [1]
    const primaryConcursoId = ids[0] ?? 1

    const [user] = await db
      .insert(usersTable)
      .values({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        plano,
        status: 'ativo',
        frequencia,
        cidadeId,
        concursoId: primaryConcursoId,
        concursoIds: JSON.stringify(ids),
      })
      .returning()

    const cidade = user.cidadeId
      ? await db.select().from(cidadesTable).where(eq(cidadesTable.id, user.cidadeId)).limit(1)
      : []

    return NextResponse.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      plano: user.plano,
      status: user.status,
      frequencia: user.frequencia,
      cidadeId: user.cidadeId ?? null,
      cidadeNome: cidade[0]?.nome ?? null,
      concursoId: user.concursoId ?? null,
      concursoIds: parseIds(user.concursoIds),
      createdAt: user.createdAt.toISOString(),
    }, { status: 201 })
  } catch (err: unknown) {
    const e = err as { code?: string }
    if (e.code === '23505') {
      return NextResponse.json({ error: 'Este email já está cadastrado.' }, { status: 409 })
    }
    console.error('Error registering user:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Erro interno ao cadastrar usuário.' }, { status: 500 })
  }
}

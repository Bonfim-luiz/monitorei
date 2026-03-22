import { NextRequest, NextResponse } from 'next/server'
import { db } from '@workspace/db'
import { usersTable, cidadesTable, concursosTable, convocacoesTable } from '@workspace/db/schema'
import { eq, inArray } from 'drizzle-orm'

function parseIds(raw: string | null | undefined): number[] {
  try {
    const parsed = JSON.parse(raw ?? '[]')
    return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : []
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email é obrigatório.' }, { status: 400 })
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
    }

    const ids = parseIds(user.concursoIds)

    const cidade = user.cidadeId
      ? await db.select().from(cidadesTable).where(eq(cidadesTable.id, user.cidadeId)).limit(1)
      : []

    const concursos = ids.length > 0
      ? await db.select().from(concursosTable).where(inArray(concursosTable.id, ids))
      : []

    const allCidades = await db.select().from(cidadesTable)
    const cidadeMap = new Map(allCidades.map((c) => [c.id, c.nome]))

    const nomeUpper = user.nome.toUpperCase()

    const concursoStatuses = await Promise.all(
      concursos.map(async (c) => {
        const allConvocacoes = await db
          .select()
          .from(convocacoesTable)
          .where(eq(convocacoesTable.concursoId, c.id))

        const totalConvocados = allConvocacoes.length

        const convocado = allConvocacoes.some(
          (cv) => cv.nome.toUpperCase().includes(nomeUpper) || nomeUpper.includes(cv.nome.toUpperCase())
        )

        const ultima = allConvocacoes
          .map((cv) => cv.data)
          .filter(Boolean)
          .sort()
          .reverse()[0] ?? null

        return {
          id: c.id,
          nome: c.nome,
          cidade: cidadeMap.get(c.cidadeId) ?? 'Desconhecida',
          convocado,
          totalConvocados,
          ultimaConvocacao: ultima,
        }
      })
    )

    return NextResponse.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      plano: user.plano,
      status: user.status,
      frequencia: user.frequencia,
      cidadeNome: cidade[0]?.nome ?? null,
      concursos: concursoStatuses,
    })
  } catch (err) {
    console.error('Error getting user profile:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Erro ao buscar perfil.' }, { status: 500 })
  }
}

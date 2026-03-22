import { NextResponse } from 'next/server'
import { db } from '@workspace/db'
import { convocacoesTable, concursosTable } from '@workspace/db/schema'

export async function GET() {
  try {
    const convocacoes = await db.select().from(convocacoesTable).orderBy(convocacoesTable.data)
    const concursos = await db.select().from(concursosTable)
    const concursoMap = new Map(concursos.map((c) => [c.id, c.nome]))

    return NextResponse.json({
      convocacoes: convocacoes.map((c) => ({
        id: c.id,
        nome: c.nome,
        concursoId: c.concursoId,
        concursoNome: concursoMap.get(c.concursoId) ?? 'Desconhecido',
        data: c.data,
      })),
    })
  } catch (err) {
    console.error('Error listing convocacoes:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Erro ao buscar convocações.' }, { status: 500 })
  }
}

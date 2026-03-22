import { NextResponse } from 'next/server'
import { db } from '@workspace/db'
import { concursosTable, cidadesTable } from '@workspace/db/schema'

export async function GET() {
  try {
    const concursos = await db.select().from(concursosTable)
    const cidades = await db.select().from(cidadesTable)
    const cidadeMap = new Map(cidades.map((c) => [c.id, c.nome]))

    return NextResponse.json({
      concursos: concursos.map((c) => ({
        id: c.id,
        nome: c.nome,
        cidadeId: c.cidadeId,
        cidadeNome: cidadeMap.get(c.cidadeId) ?? 'Desconhecida',
      })),
    })
  } catch (err) {
    console.error('Error listing concursos:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Erro ao buscar concursos.' }, { status: 500 })
  }
}

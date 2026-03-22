import { NextResponse } from 'next/server'
import { db } from '@workspace/db'
import { cidadesTable } from '@workspace/db/schema'

export async function GET() {
  try {
    const cidades = await db.select().from(cidadesTable)
    return NextResponse.json({ cidades })
  } catch (err) {
    console.error('Error listing cidades:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Erro ao buscar cidades.' }, { status: 500 })
  }
}

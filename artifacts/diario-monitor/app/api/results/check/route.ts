import { NextResponse } from 'next/server'
import { db } from '@workspace/db'
import { usersTable, convocacoesTable } from '@workspace/db/schema'
import { eq } from 'drizzle-orm'
import { getPdfState, setResultsState, getResultsState } from '@workspace/redis'

export async function POST() {
  try {
    const pdfState = await getPdfState()

    if (!pdfState.pdfText) {
      return NextResponse.json(
        { error: 'Nenhum PDF carregado. Faça o upload primeiro.' },
        { status: 400 }
      )
    }

    const textUpper = pdfState.pdfText.toUpperCase()
    const users = await db.select().from(usersTable)

    const results = users.map((user) => ({
      userId: user.id,
      nome: user.nome,
      email: user.email,
      found: textUpper.includes(user.nome.toUpperCase()),
    }))

    // Save results to Redis
    await setResultsState(results)

    // Collect names found (for saving to convocacoes)
    const foundNames = results.filter((r) => r.found).map((r) => r.nome)

    // Save all found names to convocacoes table (default concurso_id = 1)
    const today = new Date().toISOString().slice(0, 10)
    if (foundNames.length > 0) {
      // Remove today's entries for this concurso to avoid duplicates, then re-insert
      await db.delete(convocacoesTable).where(eq(convocacoesTable.data, today))

      await db.insert(convocacoesTable).values(
        foundNames.map((nome) => ({
          nome,
          concursoId: 1,
          data: today,
        }))
      )
    }

    const resultsState = await getResultsState()

    return NextResponse.json({
      results: resultsState.results,
      checkedAt: resultsState.checkedAt,
      hasPdf: true,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error running check:', msg)
    return NextResponse.json({ error: 'Erro ao verificar convocações.' }, { status: 500 })
  }
}

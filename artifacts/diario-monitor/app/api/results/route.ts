import { NextResponse } from 'next/server'
import { getPdfState, getResultsState } from '@workspace/redis'

export async function GET() {
  try {
    const pdfState = await getPdfState()
    const resultsState = await getResultsState()

    return NextResponse.json({
      results: resultsState.results,
      checkedAt: resultsState.checkedAt,
      hasPdf: pdfState.filename !== null,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error getting results:', msg)
    return NextResponse.json({ error: 'Erro ao buscar resultados.' }, { status: 500 })
  }
}

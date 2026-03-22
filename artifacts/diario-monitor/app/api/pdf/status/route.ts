import { NextResponse } from 'next/server'
import { getPdfState } from '@workspace/redis'

export async function GET() {
  try {
    const state = await getPdfState()
    return NextResponse.json({
      hasFile: state.filename !== null,
      filename: state.filename ?? null,
      uploadedAt: state.uploadedAt ?? null,
      pageCount: state.pageCount ?? null,
    })
  } catch (err) {
    console.error('Error getting PDF status:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Erro ao buscar status do PDF.' }, { status: 500 })
  }
}

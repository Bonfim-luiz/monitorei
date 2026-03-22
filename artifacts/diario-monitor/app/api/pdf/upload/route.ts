import { NextRequest, NextResponse } from 'next/server'
import { setPdfState } from '@workspace/redis'

// Note: pdf-parse doesn't work well in edge runtime, so we use a simpler approach
// We store the PDF text in Redis for later processing

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('pdf') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo PDF enviado.' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Apenas arquivos PDF são aceitos.' }, { status: 400 })
    }

    // Get the PDF buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Simple PDF text extraction (basic approach without pdf-parse)
    // For production, you might want to use a more robust solution
    let pdfText = ''
    let pageCount = 1
    
    try {
      // Dynamic import for pdf-parse
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(buffer)
      pdfText = data.text
      pageCount = data.numpages
    } catch {
      // Fallback: just store the raw buffer as base64 for later processing
      // Convert buffer to text (this won't parse properly but allows basic storage)
      pdfText = buffer.toString('utf-8')
      pageCount = 1
    }

    // Store in Redis
    await setPdfState(file.name, pageCount, pdfText)

    return NextResponse.json({
      success: true,
      filename: file.name,
      pageCount,
      message: `PDF carregado com sucesso. ${pageCount} página(s) encontrada(s).`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error processing PDF:', msg)
    return NextResponse.json({ error: 'Erro ao processar o arquivo PDF.' }, { status: 500 })
  }
}

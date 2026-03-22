import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// PDF State keys
const PDF_STATE_KEY = 'pdf:state'

export interface PdfState {
  filename: string | null
  uploadedAt: string | null
  pageCount: number | null
  pdfText: string | null
}

export async function getPdfState(): Promise<PdfState> {
  const state = await redis.get<PdfState>(PDF_STATE_KEY)
  return state ?? {
    filename: null,
    uploadedAt: null,
    pageCount: null,
    pdfText: null,
  }
}

export async function setPdfState(
  filename: string,
  pageCount: number,
  pdfText: string
): Promise<void> {
  const state: PdfState = {
    filename,
    uploadedAt: new Date().toISOString(),
    pageCount,
    pdfText,
  }
  await redis.set(PDF_STATE_KEY, state)
}

export async function clearPdfState(): Promise<void> {
  await redis.del(PDF_STATE_KEY)
}

// Results state
const RESULTS_KEY = 'results:state'

export interface CheckResult {
  userId: number
  nome: string
  email: string
  found: boolean
}

export interface ResultsState {
  results: CheckResult[]
  checkedAt: string | null
}

export async function getResultsState(): Promise<ResultsState> {
  const state = await redis.get<ResultsState>(RESULTS_KEY)
  return state ?? { results: [], checkedAt: null }
}

export async function setResultsState(results: CheckResult[]): Promise<void> {
  await redis.set(RESULTS_KEY, {
    results,
    checkedAt: new Date().toISOString(),
  })
}

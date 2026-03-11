import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Monitorei - Nunca perca sua vaga em concurso público',
  description: 'Monitore diariamente sua classificação em concursos públicos. Receba alertas por email e WhatsApp sobre convocações e nunca perca o prazo.',
  keywords: 'concurso público, monitoramento, convocação, diário oficial, alerta, classificação',
  authors: [{ name: 'Monitorei' }],
  openGraph: {
    title: 'Monitorei - Nunca perca sua vaga em concurso público',
    description: 'Monitore diariamente sua classificação em concursos públicos. Receba alertas automáticos.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

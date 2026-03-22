import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getResultsState } from '@workspace/redis'

export async function POST() {
  try {
    const resultsState = await getResultsState()

    if (resultsState.results.length === 0) {
      return NextResponse.json(
        { error: 'Execute a verificação antes de enviar notificações.' },
        { status: 400 }
      )
    }

    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        { error: 'Credenciais de email não configuradas. Defina EMAIL_USER e EMAIL_PASS.' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: emailUser, pass: emailPass },
    })

    let sent = 0
    let failed = 0

    for (const result of resultsState.results) {
      const message = result.found
        ? `Olá, ${result.nome}!\n\nSeu nome foi encontrado na convocação do Diário Oficial de hoje.\n\nAcesse o portal Monitorei para mais detalhes.\n\nMonitorei`
        : `Olá, ${result.nome}!\n\nSeu nome não apareceu nas convocações do Diário Oficial de hoje.\n\nContinue acompanhando.\n\nMonitorei`

      try {
        await transporter.sendMail({
          from: `"Monitorei" <${emailUser}>`,
          to: result.email,
          subject: 'Monitorei – Resultado do Dia',
          text: message,
        })
        sent++
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`Failed to send email to ${result.email}:`, msg)
        failed++
      }
    }

    return NextResponse.json({
      sent,
      failed,
      message: `${sent} email(s) enviado(s) com sucesso.${failed > 0 ? ` ${failed} falha(s).` : ''}`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error sending notifications:', msg)
    return NextResponse.json({ error: 'Erro ao enviar notificações.' }, { status: 500 })
  }
}

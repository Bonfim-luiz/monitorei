import { NextRequest, NextResponse } from 'next/server'
import { db } from '@workspace/db'
import { usersTable } from '@workspace/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params
  const id = Number(idParam)

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  try {
    const deleted = await db.delete(usersTable).where(eq(usersTable.id, id)).returning()
    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: 'Usuário removido com sucesso.' })
  } catch (err) {
    console.error('Error deleting user:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Erro ao remover usuário.' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, senha } = body

    const usuario = await login(nome, senha)

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set('usuario', JSON.stringify(usuario), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    })

    return NextResponse.json({ success: true, usuario })
  } catch {
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { login, setSessaoUsuario } from '@/lib/auth'

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

    await setSessaoUsuario(usuario)

    return NextResponse.json({ success: true, usuario })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
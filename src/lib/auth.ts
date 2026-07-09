import { cookies } from 'next/headers'
import * as bcrypt from 'bcryptjs'
import { usuarioService } from '@/domains/usuarios/services'

export interface UsuarioSessao {
  id: string
  nome: string
}

export async function login(nome: string, senha: string): Promise<UsuarioSessao | null> {
  const usuario = await usuarioService.findByNome(nome)
  
  if (!usuario) {
    return null
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash)
  
  if (!senhaValida) {
    return null
  }

  return {
    id: usuario.id,
    nome: usuario.nome
  }
}

export async function getSessaoUsuario(): Promise<UsuarioSessao | null> {
  const cookieStore = await cookies()
  const usuarioCookie = cookieStore.get('usuario')
  
  if (!usuarioCookie) {
    return null
  }

  try {
    const usuario = JSON.parse(usuarioCookie.value) as UsuarioSessao
    return usuario
  } catch {
    return null
  }
}

export async function setSessaoUsuario(usuario: UsuarioSessao) {
  const cookieStore = await cookies()
  cookieStore.set('usuario', JSON.stringify(usuario), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  })
}

export async function limparSessao() {
  const cookieStore = await cookies()
  cookieStore.delete('usuario')
}
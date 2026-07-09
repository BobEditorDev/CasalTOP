'use server'

import { cookies } from 'next/headers'

export interface UsuarioSessao {
  id: string
  nome: string
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
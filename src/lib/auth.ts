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
import { prisma } from '@/lib/prisma'
import { Usuario } from '../types'

export class UsuarioRepository {
  async findAll(): Promise<Usuario[]> {
    const usuarios = await prisma.usuario.findMany()
    return usuarios.map(usuario => ({
      ...usuario,
      salario: Number(usuario.salario)
    }))
  }

  async findByNome(nome: string): Promise<Usuario | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { nome }
    })
    
    if (!usuario) return null
    
    return {
      ...usuario,
      salario: Number(usuario.salario)
    }
  }
}

export const usuarioRepository = new UsuarioRepository()
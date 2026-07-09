import { usuarioRepository } from '../repositories'

export class UsuarioService {
  async getAll() {
    return usuarioRepository.findAll()
  }

  async findByNome(nome: string) {
    return usuarioRepository.findByNome(nome)
  }
}

export const usuarioService = new UsuarioService()
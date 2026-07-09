import { prisma } from '@/lib/prisma'
import { Configuracao } from '../types'

export class ConfiguracaoRepository {
  async get(): Promise<Configuracao | null> {
    const config = await prisma.configuracao.findFirst()
    
    if (!config) return null
    
    return {
      ...config,
      percentualRodrigo: Number(config.percentualRodrigo),
      percentualGiovana: Number(config.percentualGiovana)
    }
  }
}

export const configuracaoRepository = new ConfiguracaoRepository()
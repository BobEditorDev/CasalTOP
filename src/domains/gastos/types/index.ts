import { TipoPagamento } from '@prisma/client'

export interface Gasto {
  id: string
  data: Date
  categoria: string
  tipo: TipoPagamento
  valor: number
  observacao?: string | null
  criadoEm: Date
  atualizadoEm: Date
  usuarioId: string
}

export interface CreateGastoInput {
  data: Date
  categoria: string
  tipo: TipoPagamento
  valor: number
  observacao?: string
  usuarioId: string
}

export interface UpdateGastoInput {
  data?: Date
  categoria?: string
  tipo?: TipoPagamento
  valor?: number
  observacao?: string
}
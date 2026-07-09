import { TipoPagamento } from '@prisma/client'

export interface Gasto {
  id: string
  data: Date
  categoria: string
  tipo: TipoPagamento
  valor: number
  observacao?: string | null
  parcelado: boolean
  totalParcelas?: number | null
  parcelaAtual?: number | null
  parcelamentoGrupoId?: string | null
  fixo: boolean
  fixoGrupoId?: string | null
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
  parcelado?: boolean
  totalParcelas?: number
  parcelaAtual?: number
  parcelamentoGrupoId?: string
  fixo?: boolean
  fixoGrupoId?: string
}

export interface UpdateGastoInput {
  data?: Date
  categoria?: string
  tipo?: TipoPagamento
  valor?: number
  observacao?: string
  parcelado?: boolean
  totalParcelas?: number
  parcelaAtual?: number
  parcelamentoGrupoId?: string
  fixo?: boolean
  fixoGrupoId?: string
}
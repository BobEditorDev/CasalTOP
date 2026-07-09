import { z } from 'zod'
import { TipoPagamento } from '@prisma/client'

export const createGastoSchema = z.object({
  data: z.coerce.date(),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  tipo: z.nativeEnum(TipoPagamento),
  valor: z.coerce.number().positive('Valor deve ser positivo'),
  observacao: z.string().optional(),
  usuarioId: z.string()
})

export const updateGastoSchema = z.object({
  data: z.coerce.date().optional(),
  categoria: z.string().min(1).optional(),
  tipo: z.nativeEnum(TipoPagamento).optional(),
  valor: z.coerce.number().positive().optional(),
  observacao: z.string().optional()
})

export type CreateGastoInput = z.infer<typeof createGastoSchema>
export type UpdateGastoInput = z.infer<typeof updateGastoSchema>
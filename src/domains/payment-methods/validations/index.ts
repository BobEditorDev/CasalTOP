import { z } from 'zod'

export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
})

export const updatePaymentMethodSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres').optional(),
})

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>
import { z } from 'zod'

export const createInstallmentGroupSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição deve ter no máximo 200 caracteres'),
  totalAmount: z.coerce.number().positive('Valor total deve ser positivo'),
  numberOfInstallments: z.coerce.number().int('Número de parcelas deve ser inteiro').min(2, 'Mínimo de 2 parcelas').max(120, 'Máximo de 120 parcelas'),
  firstInstallmentDate: z.coerce.date(),
})

export type CreateInstallmentGroupInput = z.infer<typeof createInstallmentGroupSchema>
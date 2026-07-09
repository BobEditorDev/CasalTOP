import { z } from 'zod'

export const createRecurringExpenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição deve ter no máximo 200 caracteres'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  day: z.coerce.number().int('Dia deve ser inteiro').min(1, 'Dia deve ser entre 1 e 31').max(31, 'Dia deve ser entre 1 e 31'),
})

export const updateRecurringExpenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  amount: z.coerce.number().positive('Valor deve ser positivo').optional(),
  day: z.coerce.number().int('Dia deve ser inteiro').min(1, 'Dia deve ser entre 1 e 31').max(31, 'Dia deve ser entre 1 e 31').optional(),
  active: z.boolean().optional(),
})

export type CreateRecurringExpenseInput = z.infer<typeof createRecurringExpenseSchema>
export type UpdateRecurringExpenseInput = z.infer<typeof updateRecurringExpenseSchema>
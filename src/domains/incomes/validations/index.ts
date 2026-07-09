import { z } from 'zod'

export const createIncomeSchema = z.object({
  date: z.coerce.date(),
  competence: z.coerce.date(),
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição deve ter no máximo 200 caracteres'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  observation: z.string().optional(),
  userId: z.string().min(1, 'Usuário é obrigatório'),
  personId: z.string().min(1, 'Pessoa é obrigatória'),
})

export const updateIncomeSchema = z.object({
  date: z.coerce.date().optional(),
  competence: z.coerce.date().optional(),
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  amount: z.coerce.number().positive('Valor deve ser positivo').optional(),
  observation: z.string().optional(),
  personId: z.string().min(1, 'Pessoa é obrigatória').optional(),
})

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>
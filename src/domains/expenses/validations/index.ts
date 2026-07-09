import { z } from 'zod'

export const createExpenseSchema = z.object({
  date: z.coerce.date(),
  competence: z.coerce.date(),
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição deve ter no máximo 200 caracteres'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  observation: z.string().optional(),
  type: z.enum(['UNIQUE', 'INSTALLMENT', 'RECURRING']),
  userId: z.string().min(1, 'Usuário é obrigatório'),
  personId: z.string().min(1, 'Pessoa é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  paymentMethodId: z.string().min(1, 'Forma de pagamento é obrigatória'),
  installmentGroupId: z.string().optional(),
  installmentNumber: z.number().optional(),
  recurringExpenseId: z.string().optional(),
})

export const updateExpenseSchema = z.object({
  date: z.coerce.date().optional(),
  competence: z.coerce.date().optional(),
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  amount: z.coerce.number().positive('Valor deve ser positivo').optional(),
  observation: z.string().optional(),
  personId: z.string().min(1, 'Pessoa é obrigatória').optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória').optional(),
  paymentMethodId: z.string().min(1, 'Forma de pagamento é obrigatória').optional(),
})

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
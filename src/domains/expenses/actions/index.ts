'use server'

import { expenseService } from '../services'
import { createExpenseSchema, updateExpenseSchema } from '../validations'
import { revalidatePath } from 'next/cache'

export async function getExpenses() {
  return expenseService.getAll()
}

export async function getExpense(id: string) {
  return expenseService.getById(id)
}

export async function getExpensesByCompetence(year: number, month: number) {
  return expenseService.getByCompetence(year, month)
}

export async function createExpense(formData: FormData) {
  const data = {
    date: formData.get('date') as string,
    competence: formData.get('competence') as string,
    description: formData.get('description') as string,
    amount: formData.get('amount') as string,
    observation: formData.get('observation') as string | undefined,
    type: formData.get('type') as 'UNIQUE' | 'INSTALLMENT' | 'RECURRING',
    userId: formData.get('userId') as string,
    personId: formData.get('personId') as string,
    categoryId: formData.get('categoryId') as string,
    paymentMethodId: formData.get('paymentMethodId') as string,
  }
  
  const validated = createExpenseSchema.parse(data)
  await expenseService.create(validated)
  revalidatePath('/expenses')
}

export async function updateExpense(id: string, formData: FormData) {
  const data = {
    date: formData.get('date') as string | undefined,
    competence: formData.get('competence') as string | undefined,
    description: formData.get('description') as string | undefined,
    amount: formData.get('amount') as string | undefined,
    observation: formData.get('observation') as string | undefined,
    personId: formData.get('personId') as string | undefined,
    categoryId: formData.get('categoryId') as string | undefined,
    paymentMethodId: formData.get('paymentMethodId') as string | undefined,
  }
  
  const validated = updateExpenseSchema.parse(data)
  await expenseService.update(id, validated)
  revalidatePath('/expenses')
}

export async function deleteExpense(id: string) {
  await expenseService.delete(id)
  revalidatePath('/expenses')
}
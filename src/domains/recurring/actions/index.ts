'use server'

import { recurringExpenseService } from '../services'
import { createRecurringExpenseSchema, updateRecurringExpenseSchema } from '../validations'
import { revalidatePath } from 'next/cache'

export async function getRecurringExpenses() {
  return recurringExpenseService.getAll()
}

export async function getActiveRecurringExpenses() {
  return recurringExpenseService.getActive()
}

export async function getRecurringExpense(id: string) {
  return recurringExpenseService.getById(id)
}

export async function createRecurringExpense(formData: FormData) {
  const data = {
    description: formData.get('description') as string,
    amount: formData.get('amount') as string,
    day: formData.get('day') as string,
  }
  
  const validated = createRecurringExpenseSchema.parse(data)
  await recurringExpenseService.create(validated)
  revalidatePath('/recurring')
}

export async function updateRecurringExpense(id: string, formData: FormData) {
  const data = {
    description: formData.get('description') as string | undefined,
    amount: formData.get('amount') as string | undefined,
    day: formData.get('day') as string | undefined,
    active: formData.get('active') as string | undefined,
  }
  
  const validated = updateRecurringExpenseSchema.parse({
    ...data,
    active: data.active === 'true'
  })
  await recurringExpenseService.update(id, validated)
  revalidatePath('/recurring')
}

export async function deactivateRecurringExpense(id: string) {
  await recurringExpenseService.deactivate(id)
  revalidatePath('/recurring')
}

export async function deleteRecurringExpense(id: string) {
  await recurringExpenseService.delete(id)
  revalidatePath('/recurring')
}

export async function generateExpenseForMonth(
  recurringId: string,
  year: number,
  month: number,
  formData: FormData
) {
  const expenseData = {
    userId: formData.get('userId') as string,
    personId: formData.get('personId') as string,
    categoryId: formData.get('categoryId') as string,
    paymentMethodId: formData.get('paymentMethodId') as string,
    observation: formData.get('observation') as string | undefined,
  }
  
  await recurringExpenseService.generateExpenseForMonth(
    recurringId,
    year,
    month,
    expenseData
  )
  revalidatePath('/expenses')
  revalidatePath('/recurring')
}

export async function generateAllForMonth(
  year: number,
  month: number,
  formData: FormData
) {
  const expenseData = {
    userId: formData.get('userId') as string,
    personId: formData.get('personId') as string,
    categoryId: formData.get('categoryId') as string,
    paymentMethodId: formData.get('paymentMethodId') as string,
    observation: formData.get('observation') as string | undefined,
  }
  
  await recurringExpenseService.generateAllForMonth(
    year,
    month,
    expenseData
  )
  revalidatePath('/expenses')
  revalidatePath('/recurring')
}
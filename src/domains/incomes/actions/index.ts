'use server'

import { incomeService } from '../services'
import { createIncomeSchema, updateIncomeSchema } from '../validations'
import { revalidatePath } from 'next/cache'

export async function getIncomes() {
  return incomeService.getAll()
}

export async function getIncome(id: string) {
  return incomeService.getById(id)
}

export async function getIncomesByCompetence(year: number, month: number) {
  return incomeService.getByCompetence(year, month)
}

export async function createIncome(formData: FormData) {
  const data = {
    date: formData.get('date') as string,
    competence: formData.get('competence') as string,
    description: formData.get('description') as string,
    amount: formData.get('amount') as string,
    observation: formData.get('observation') as string | undefined,
    userId: formData.get('userId') as string,
    personId: formData.get('personId') as string,
  }
  
  const validated = createIncomeSchema.parse(data)
  await incomeService.create(validated)
  revalidatePath('/incomes')
}

export async function updateIncome(id: string, formData: FormData) {
  const data = {
    date: formData.get('date') as string | undefined,
    competence: formData.get('competence') as string | undefined,
    description: formData.get('description') as string | undefined,
    amount: formData.get('amount') as string | undefined,
    observation: formData.get('observation') as string | undefined,
    personId: formData.get('personId') as string | undefined,
  }
  
  const validated = updateIncomeSchema.parse(data)
  await incomeService.update(id, validated)
  revalidatePath('/incomes')
}

export async function deleteIncome(id: string) {
  await incomeService.delete(id)
  revalidatePath('/incomes')
}
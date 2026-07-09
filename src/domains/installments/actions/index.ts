'use server'

import { installmentService } from '../services'
import { createInstallmentGroupSchema } from '../validations'
import { revalidatePath } from 'next/cache'

export async function getInstallmentGroups() {
  return installmentService.getAll()
}

export async function getInstallmentGroup(id: string) {
  return installmentService.getById(id)
}

export async function createInstallmentGroup(formData: FormData) {
  const data = {
    description: formData.get('description') as string,
    totalAmount: formData.get('totalAmount') as string,
    numberOfInstallments: formData.get('numberOfInstallments') as string,
    firstInstallmentDate: formData.get('firstInstallmentDate') as string,
    userId: formData.get('userId') as string,
    personId: formData.get('personId') as string,
    categoryId: formData.get('categoryId') as string,
    paymentMethodId: formData.get('paymentMethodId') as string,
    observation: formData.get('observation') as string | undefined,
  }
  
  const validated = createInstallmentGroupSchema.parse({
    description: data.description,
    totalAmount: data.totalAmount,
    numberOfInstallments: data.numberOfInstallments,
    firstInstallmentDate: data.firstInstallmentDate,
  })

  await installmentService.createInstallmentGroup(validated, {
    userId: data.userId,
    personId: data.personId,
    categoryId: data.categoryId,
    paymentMethodId: data.paymentMethodId,
    observation: data.observation,
  })
  
  revalidatePath('/expenses')
  revalidatePath('/installments')
}

export async function deleteInstallmentGroup(id: string) {
  await installmentService.deleteInstallmentGroup(id)
  revalidatePath('/expenses')
  revalidatePath('/installments')
}

export async function deleteFutureInstallments(groupId: string, currentInstallmentNumber: number) {
  await installmentService.deleteFutureInstallments(groupId, currentInstallmentNumber)
  revalidatePath('/expenses')
  revalidatePath('/installments')
}
'use server'

import { paymentMethodService } from '../services'
import { createPaymentMethodSchema, updatePaymentMethodSchema } from '../validations'
import { revalidatePath } from 'next/cache'

export async function getPaymentMethods() {
  return paymentMethodService.getAll()
}

export async function getPaymentMethod(id: string) {
  return paymentMethodService.getById(id)
}

export async function createPaymentMethod(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
  }
  
  const validated = createPaymentMethodSchema.parse(data)
  await paymentMethodService.create(validated)
  revalidatePath('/payment-methods')
}

export async function updatePaymentMethod(id: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string | undefined,
  }
  
  const validated = updatePaymentMethodSchema.parse(data)
  await paymentMethodService.update(id, validated)
  revalidatePath('/payment-methods')
}

export async function deletePaymentMethod(id: string) {
  await paymentMethodService.delete(id)
  revalidatePath('/payment-methods')
}
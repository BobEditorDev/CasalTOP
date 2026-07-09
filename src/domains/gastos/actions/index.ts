'use server'

import { gastoService } from '../services'
import { createGastoSchema, updateGastoSchema } from '../validations'
import { revalidatePath } from 'next/cache'
import { parseDateInput } from '@/lib/date-utils'

export async function getGastos() {
  return gastoService.getAll()
}

export async function getGastosByMonth(year: number, month: number) {
  return gastoService.getByMonth(year, month)
}

export async function getDistinctCategorias() {
  return gastoService.getDistinctCategorias()
}

export async function createGasto(formData: FormData) {
  const observacao = formData.get('observacao') as string | null

  const data = {
    data: parseDateInput(formData.get('data') as string),
    categoria: formData.get('categoria') as string,
    tipo: formData.get('tipo') as 'RODRIGO_PAGA' | 'GIOVANA_PAGA' | 'RODRIGO_PAGOU_DA_GIOVANA' | 'GIOVANA_PAGOU_DO_RODRIGO',
    valor: Number(formData.get('valor')) / 100,
    observacao: observacao && observacao.trim() ? observacao.trim() : null,
    usuarioId: formData.get('usuarioId') as string
  }

  const validated = createGastoSchema.parse(data)
  await gastoService.create(validated)

  revalidatePath('/')
  revalidatePath('/lancamentos')
  revalidatePath('/resumo')
}

export async function updateGasto(id: string, formData: FormData) {
  const observacao = formData.get('observacao') as string | null

  const data = {
    data: formData.get('data') ? parseDateInput(formData.get('data') as string) : undefined,
    categoria: formData.get('categoria') as string | null,
    tipo: formData.get('tipo') as 'RODRIGO_PAGA' | 'GIOVANA_PAGA' | 'RODRIGO_PAGOU_DA_GIOVANA' | 'GIOVANA_PAGOU_DO_RODRIGO' | null,
    valor: formData.get('valor') ? Number(formData.get('valor')) / 100 : undefined,
    observacao: observacao && observacao.trim() ? observacao.trim() : null
  }

  const validated = updateGastoSchema.parse(data)
  await gastoService.update(id, validated)

  revalidatePath('/')
  revalidatePath('/lancamentos')
  revalidatePath('/resumo')
}

export async function deleteGasto(id: string) {
  await gastoService.delete(id)

  revalidatePath('/')
  revalidatePath('/lancamentos')
  revalidatePath('/resumo')
}
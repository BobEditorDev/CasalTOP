'use server'

import { gastoService } from '../services'
import { createGastoSchema, updateGastoSchema } from '../validations'
import { revalidatePath } from 'next/cache'
import { parseDateInput } from '@/lib/date-utils'
import { configuracaoRepository } from '@/domains/configuracao/repositories'
import { calcularRateioMensal } from '@/lib/calculos'
import crypto from 'crypto'

export async function getGastos() {
  return gastoService.getAll()
}

export async function getGastosByMonth(year: number, month: number) {
  return gastoService.getByMonth(year, month)
}

export async function getDistinctCategorias() {
  return gastoService.getDistinctCategorias()
}

export async function getTopCategorias(year: number, month: number): Promise<string[]> {
  const gastos = await gastoService.getByMonth(year, month)
  const frequencias = new Map<string, number>()
  
  gastos.forEach(g => {
    frequencias.set(g.categoria, (frequencias.get(g.categoria) || 0) + 1)
  })

  return Array.from(frequencias.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, 6)
}

export async function getMonthSummary(year: number, month: number) {
  const gastos = await gastoService.getByMonth(year, month)
  const config = await configuracaoRepository.get()

  const percentualRodrigo = config?.percentualRodrigo || 62.5
  const percentualGiovana = config?.percentualGiovana || 37.5

  const gastosParaCalculo = gastos.map(g => ({
    tipo: g.tipo,
    valor: g.valor,
    data: g.data,
    categoria: g.categoria
  }))

  const rateio = calcularRateioMensal(
    gastosParaCalculo,
    percentualRodrigo,
    percentualGiovana,
    year,
    month
  )

  return {
    gastos,
    rateio,
    percentualRodrigo,
    percentualGiovana
  }
}

export async function createGasto(formData: FormData) {
  const observacao = formData.get('observacao') as string | null
  const parcelado = formData.get('parcelado') === 'true'
  const fixo = formData.get('fixo') === 'true'
  const totalParcelas = parcelado ? Number(formData.get('totalParcelas')) : undefined
  const dataLancamento = parseDateInput(formData.get('data') as string)
  const valorTotal = Number(formData.get('valor')) / 100

  const baseData = {
    categoria: formData.get('categoria') as string,
    tipo: formData.get('tipo') as 'RODRIGO_PAGA' | 'GIOVANA_PAGA' | 'RODRIGO_PAGOU_DA_GIOVANA' | 'GIOVANA_PAGOU_DO_RODRIGO',
    observacao: observacao && observacao.trim() ? observacao.trim() : undefined,
    usuarioId: formData.get('usuarioId') as string
  }

  if (parcelado && totalParcelas && totalParcelas > 1) {
    const groupId = crypto.randomUUID()
    const valorParcela = Number((valorTotal / totalParcelas).toFixed(2)) // arredonda pra 2 casas
    
    // ajuste no valor da ultima parcela se a divisão não for exata
    let valorAcumulado = 0
    
    for (let i = 1; i <= totalParcelas; i++) {
      const dataParcela = new Date(dataLancamento)
      dataParcela.setMonth(dataParcela.getMonth() + i - 1)
      
      let valorDessaParcela = valorParcela
      if (i === totalParcelas) {
        valorDessaParcela = Number((valorTotal - valorAcumulado).toFixed(2))
      } else {
        valorAcumulado += valorParcela
      }
      
      const observacaoParcela = baseData.observacao 
        ? `${baseData.observacao} (${i}/${totalParcelas})` 
        : `Parcela ${i}/${totalParcelas}`

      const validated = createGastoSchema.parse({
        ...baseData,
        data: dataParcela,
        valor: valorDessaParcela,
        observacao: observacaoParcela,
        parcelado: true,
        totalParcelas,
        parcelaAtual: i,
        parcelamentoGrupoId: groupId
      })
      await gastoService.create(validated)
    }
  } else if (fixo) {
    const groupId = crypto.randomUUID()
    
    for (let i = 0; i < 12; i++) {
      const dataFixo = new Date(dataLancamento)
      dataFixo.setMonth(dataFixo.getMonth() + i)
      
      const validated = createGastoSchema.parse({
        ...baseData,
        data: dataFixo,
        valor: valorTotal,
        fixo: true,
        fixoGrupoId: groupId
      })
      await gastoService.create(validated)
    }
  } else {
    const validated = createGastoSchema.parse({
      ...baseData,
      data: dataLancamento,
      valor: valorTotal
    })
    await gastoService.create(validated)
  }

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

export async function duplicateGasto(id: string) {
  const original = await gastoService.getById(id)
  if (!original) {
    throw new Error('Gasto original não encontrado')
  }

  const data = {
    data: new Date(),
    categoria: original.categoria,
    tipo: original.tipo,
    valor: original.valor,
    observacao: original.observacao || null,
    usuarioId: original.usuarioId
  }

  const validated = createGastoSchema.parse(data)
  const novoGasto = await gastoService.create(validated)

  revalidatePath('/')
  revalidatePath('/lancamentos')
  revalidatePath('/resumo')
  
  return novoGasto
}
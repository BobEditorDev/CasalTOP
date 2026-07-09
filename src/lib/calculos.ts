import { TipoPagamento } from '@prisma/client'

export interface ResultadoRateio {
  totalCompartilhado: number
  parteGiovana: number
  parteRodrigo: number
  giovanaDevePagar: boolean // true se Giovana deve pagar para Rodrigo
}

export interface GastoParaCalculo {
  tipo: TipoPagamento
  valor: number
  data: Date
}

/**
 * Calcula o rateio de gastos para um mês específico
 * Seguindo exatamente a fórmula especificada no plano
 */
export function calcularRateioMensal(
  gastos: GastoParaCalculo[],
  percentualRodrigo: number,
  percentualGiovana: number,
  ano: number,
  mes: number
): ResultadoRateio {
  // Filtrar gastos do mês específico
  const gastosDoMes = gastos.filter(gasto => {
    const dataGasto = new Date(gasto.data)
    return dataGasto.getFullYear() === ano && dataGasto.getMonth() === mes - 1
  })

  // Calcular Total Compartilhado
  // TotalCompartilhado(M) = Σ valor onde tipo ∈ {RODRIGO_PAGA, GIOVANA_PAGA}
  const totalCompartilhado = gastosDoMes
    .filter(gasto => gasto.tipo === 'RODRIGO_PAGA' || gasto.tipo === 'GIOVANA_PAGA')
    .reduce((acc, gasto) => acc + gasto.valor, 0)

  // Calcular Parte Giovana
  // ParteGiovana(M) = TotalCompartilhado(M) × (percentualGiovana / 100)
  //                   + Σ valor onde tipo = RODRIGO_PAGOU_DA_GIOVANA
  //                   − Σ valor onde tipo = GIOVANA_PAGA
  //                   − Σ valor onde tipo = GIOVANA_PAGOU_DO_RODRIGO
  const parteGiovanaBase = totalCompartilhado * (percentualGiovana / 100)
  
  const rodrigoPagouDaGiovana = gastosDoMes
    .filter(gasto => gasto.tipo === 'RODRIGO_PAGOU_DA_GIOVANA')
    .reduce((acc, gasto) => acc + gasto.valor, 0)
  
  const giovanaPagou = gastosDoMes
    .filter(gasto => gasto.tipo === 'GIOVANA_PAGA')
    .reduce((acc, gasto) => acc + gasto.valor, 0)
  
  const giovanaPagouDoRodrigo = gastosDoMes
    .filter(gasto => gasto.tipo === 'GIOVANA_PAGOU_DO_RODRIGO')
    .reduce((acc, gasto) => acc + gasto.valor, 0)

  const parteGiovana = parteGiovanaBase + rodrigoPagouDaGiovana - giovanaPagou - giovanaPagouDoRodrigo

  // Calcular Parte Rodrigo (informativo)
  // ParteRodrigo(M) = TotalCompartilhado(M) × (percentualRodrigo / 100)
  const parteRodrigo = totalCompartilhado * (percentualRodrigo / 100)

  // Se ParteGiovana der negativo, significa que Rodrigo deve transferir para Giovana
  const giovanaDevePagar = parteGiovana >= 0

  return {
    totalCompartilhado,
    parteGiovana,
    parteRodrigo,
    giovanaDevePagar
  }
}

/**
 * Detecta categorias recorrentes
 * Considera recorrente qualquer categoria que aparece em ≥ 6 meses distintos nos últimos 12 meses
 */
export function detectarCategoriasRecorrentes(gastos: GastoParaCalculo[]): string[] {
  const mesesDistintosPorCategoria = new Map<string, Set<string>>()

  gastos.forEach(gasto => {
    const data = new Date(gasto.data)
    const chaveMes = `${data.getFullYear()}-${data.getMonth()}`
    
    if (!mesesDistintosPorCategoria.has(gasto.categoria)) {
      mesesDistintosPorCategoria.set(gasto.categoria, new Set())
    }
    
    mesesDistintosPorCategoria.get(gasto.categoria)!.add(chaveMes)
  })

  const categoriasRecorrentes: string[] = []
  
  mesesDistintosPorCategoria.forEach((meses, categoria) => {
    if (meses.size >= 6) {
      categoriasRecorrentes.push(categoria)
    }
  })

  return categoriasRecorrentes.sort()
}

/**
 * Calcula gastos por categoria para um mês específico
 */
export function calcularGastosPorCategoria(
  gastos: GastoParaCalculo[],
  ano: number,
  mes: number
): Array<{ categoria: string; valor: number }> {
  const gastosDoMes = gastos.filter(gasto => {
    const dataGasto = new Date(gasto.data)
    return dataGasto.getFullYear() === ano && dataGasto.getMonth() === mes - 1
  })

  const gastosPorCategoria = new Map<string, number>()

  gastosDoMes.forEach(gasto => {
    const valorAtual = gastosPorCategoria.get(gasto.categoria) || 0
    gastosPorCategoria.set(gasto.categoria, valorAtual + gasto.valor)
  })

  return Array.from(gastosPorCategoria.entries())
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor)
}
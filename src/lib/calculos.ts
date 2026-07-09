import { TipoPagamento } from '@prisma/client'
import { Decimal } from 'decimal.js'

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
  categoria: string
}

function toDecimal(value: number | Decimal): Decimal {
  return value instanceof Decimal ? value : new Decimal(value)
}

function toNumber(value: Decimal): number {
  return value.toNumber()
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
    .reduce((acc, gasto) => acc.plus(toDecimal(gasto.valor)), new Decimal(0))

  // Calcular Parte Giovana
  // ParteGiovana(M) = TotalCompartilhado(M) × (percentualGiovana / 100)
  //                   + Σ valor onde tipo = RODRIGO_PAGOU_DA_GIOVANA
  //                   − Σ valor onde tipo = GIOVANA_PAGA
  //                   − Σ valor onde tipo = GIOVANA_PAGOU_DO_RODRIGO
  const percentualGiovanaDecimal = new Decimal(percentualGiovana).div(100)
  const parteGiovanaBase = totalCompartilhado.times(percentualGiovanaDecimal)

  const rodrigoPagouDaGiovana = gastosDoMes
    .filter(gasto => gasto.tipo === 'RODRIGO_PAGOU_DA_GIOVANA')
    .reduce((acc, gasto) => acc.plus(toDecimal(gasto.valor)), new Decimal(0))

  const giovanaPagou = gastosDoMes
    .filter(gasto => gasto.tipo === 'GIOVANA_PAGA')
    .reduce((acc, gasto) => acc.plus(toDecimal(gasto.valor)), new Decimal(0))

  const giovanaPagouDoRodrigo = gastosDoMes
    .filter(gasto => gasto.tipo === 'GIOVANA_PAGOU_DO_RODRIGO')
    .reduce((acc, gasto) => acc.plus(toDecimal(gasto.valor)), new Decimal(0))

  const parteGiovana = parteGiovanaBase
    .plus(rodrigoPagouDaGiovana)
    .minus(giovanaPagou)
    .minus(giovanaPagouDoRodrigo)

  // Calcular Parte Rodrigo (informativo)
  // ParteRodrigo(M) = TotalCompartilhado(M) × (percentualRodrigo / 100)
  const percentualRodrigoDecimal = new Decimal(percentualRodrigo).div(100)
  const parteRodrigo = totalCompartilhado.times(percentualRodrigoDecimal)

  // Se ParteGiovana der negativo, significa que Rodrigo deve transferir para Giovana
  const giovanaDevePagar = parteGiovana.greaterThanOrEqualTo(0)

  return {
    totalCompartilhado: toNumber(totalCompartilhado),
    parteGiovana: toNumber(parteGiovana),
    parteRodrigo: toNumber(parteRodrigo),
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

  const gastosPorCategoria = new Map<string, Decimal>()

  gastosDoMes.forEach(gasto => {
    const valorAtual = gastosPorCategoria.get(gasto.categoria) || new Decimal(0)
    gastosPorCategoria.set(gasto.categoria, valorAtual.plus(toDecimal(gasto.valor)))
  })

  return Array.from(gastosPorCategoria.entries())
    .map(([categoria, valor]) => ({ categoria, valor: toNumber(valor) }))
    .sort((a, b) => b.valor - a.valor)
}

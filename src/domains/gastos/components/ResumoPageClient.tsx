'use client'

import React, { useMemo } from 'react'
import { ContextoMensalBar } from './ContextoMensalBar'
import { ResumoDashboard } from './ResumoDashboard'
import { useMonthNavigation } from '@/shared/hooks/useMonthNavigation'
import { Gasto } from '../types'
import { calcularRateioMensal } from '@/lib/calculos'

interface ResumoPageClientProps {
  gastos: Gasto[]
  percentualRodrigo: number
  percentualGiovana: number
}

export function ResumoPageClient({
  gastos,
  percentualRodrigo,
  percentualGiovana
}: ResumoPageClientProps) {
  const { year, month, setMonth } = useMonthNavigation()

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setMonth(newYear, newMonth)
  }

  // Converter gastos do Prisma para o formato esperado pelo calcularRateioMensal
  const gastosParaCalculo = useMemo(() => gastos.map(g => ({
    tipo: g.tipo,
    valor: g.valor,
    data: new Date(g.data),
    categoria: g.categoria
  })), [gastos])

  // Calcular o rateio do mês selecionado para a barra superior
  const rateio = useMemo(() =>
    calcularRateioMensal(gastosParaCalculo, percentualRodrigo, percentualGiovana, year, month),
    [gastosParaCalculo, percentualRodrigo, percentualGiovana, year, month]
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col">
      {/* Barra de Contexto Fixa no Topo */}
      <ContextoMensalBar
        year={year}
        month={month}
        totalCompartilhado={rateio.totalCompartilhado}
        parteGiovana={rateio.parteGiovana}
        parteRodrigo={rateio.parteRodrigo}
        giovanaDevePagar={rateio.giovanaDevePagar}
        onMonthChange={handleMonthChange}
        currentTab="resumo"
      />

      {/* Conteúdo Principal */}
      <main className="max-w-4xl w-full mx-auto p-4">
        <ResumoDashboard
          gastos={gastos}
          percentualRodrigo={percentualRodrigo}
          percentualGiovana={percentualGiovana}
          ano={year}
          mes={month}
        />
      </main>
    </div>
  )
}

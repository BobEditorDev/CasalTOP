'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { calcularRateioMensal, calcularGastosPorCategoria, detectarCategoriasRecorrentes } from '@/lib/calculos'
import { Gasto } from '../types'
import { formatCurrency } from '@/lib/date-utils'

interface ResumoDashboardProps {
  gastos: Gasto[]
  percentualRodrigo: number
  percentualGiovana: number
  ano: number
  mes: number
}

export function ResumoDashboard({ gastos, percentualRodrigo, percentualGiovana, ano, mes }: ResumoDashboardProps) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const gastosParaCalculo = useMemo(() => gastos.map(g => ({
    tipo: g.tipo,
    valor: g.valor,
    data: new Date(g.data),
    categoria: g.categoria
  })), [gastos])

  const gastosPorCategoria = useMemo(() =>
    calcularGastosPorCategoria(gastosParaCalculo, ano, mes),
    [gastosParaCalculo, ano, mes]
  )

  const categoriasRecorrentes = useMemo(() =>
    detectarCategoriasRecorrentes(gastosParaCalculo),
    [gastosParaCalculo]
  )

  // Dados para gráfico dos últimos 12 meses
  const dadosGrafico = useMemo(() => {
    const resultado: Array<{ mes: string; total: number }> = []
    const dataAtual = new Date(ano, mes - 1, 1)

    for (let i = 11; i >= 0; i--) {
      const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1)
      const rateioMes = calcularRateioMensal(
        gastosParaCalculo,
        percentualRodrigo,
        percentualGiovana,
        data.getFullYear(),
        data.getMonth() + 1
      )
      resultado.push({
        mes: `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`,
        total: rateioMes.totalCompartilhado
      })
    }

    return resultado
  }, [gastosParaCalculo, percentualRodrigo, percentualGiovana, ano, mes])

  const maxTotal = Math.max(...dadosGrafico.map(d => d.total), 1)

  const formatPercentual = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Configuração de Rateio */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl p-5 shadow-xs">
        <h2 className="text-xs uppercase font-bold text-slate-400 dark:text-zinc-500 mb-3 select-none">Configuração de Rateio</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg border border-slate-100 dark:border-zinc-850/50">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mb-0.5">Rodrigo paga</p>
            <p className="text-lg font-black text-slate-800 dark:text-zinc-100">{formatPercentual(percentualRodrigo)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg border border-slate-100 dark:border-zinc-850/50">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mb-0.5">Giovana paga</p>
            <p className="text-lg font-black text-slate-800 dark:text-zinc-100">{formatPercentual(percentualGiovana)}</p>
          </div>
        </div>
      </div>

      {/* Gráfico de 12 meses */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl p-5 shadow-xs">
        <h2 className="text-xs uppercase font-bold text-slate-400 dark:text-zinc-500 mb-4 select-none">Total Compartilhado — Últimos 12 Meses</h2>
        {dadosGrafico.every(d => d.total === 0) ? (
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium py-4 text-center">Nenhum dado nos últimos 12 meses</p>
        ) : (
          <div className="space-y-4">
            {dadosGrafico.map((item) => (
              <div key={item.mes} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-zinc-400">{item.mes}</span>
                  <span className="text-slate-800 dark:text-zinc-205">{formatCurrency(item.total)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-950 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item.total / maxTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Categorias e Categorias Recorrentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gastos por Categoria */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl p-5 shadow-xs">
          <h2 className="text-xs uppercase font-bold text-slate-400 dark:text-zinc-500 mb-4 select-none">
            Gastos por Categoria ({meses[mes - 1]}/{ano})
          </h2>
          {gastosPorCategoria.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium py-4 text-center">Nenhum gasto neste mês</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {gastosPorCategoria.map((item) => (
                <div key={item.categoria} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-850/50 last:border-b-0">
                  <Link
                    href={`/?mes=${ano}-${String(mes).padStart(2, '0')}&categoria=${encodeURIComponent(item.categoria)}`}
                    className="text-xs font-bold text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-450 transition-colors cursor-pointer"
                  >
                    🏷️ {item.categoria}
                  </Link>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-100">{formatCurrency(item.valor)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categorias Recorrentes e Gastos Fixos */}
        <div className="flex flex-col gap-6">
          {/* Categorias Recorrentes */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl p-5 shadow-xs">
            <h2 className="text-xs uppercase font-bold text-slate-400 dark:text-zinc-500 mb-3 select-none">Categorias Recorrentes (≥ 6 meses)</h2>
            {categoriasRecorrentes.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium py-2 text-center">Nenhuma categoria recorrente detectada</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {categoriasRecorrentes.map((categoria) => (
                  <span
                    key={categoria}
                    className="px-2.5 py-1 bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30 rounded-full text-[10px] font-bold"
                  >
                    🏷️ {categoria}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tabela de Gastos Fixos */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl p-5 shadow-xs">
            <h2 className="text-xs uppercase font-bold text-slate-400 dark:text-zinc-500 mb-3 select-none">Gastos Fixos Recorrentes</h2>
            {gastosPorCategoria.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium py-2 text-center">Nenhum gasto fixo neste mês</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                    {gastosPorCategoria
                      .filter(item => categoriasRecorrentes.includes(item.categoria))
                      .map((item) => (
                        <tr key={item.categoria}>
                          <td className="py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                            <Link
                              href={`/?mes=${ano}-${String(mes).padStart(2, '0')}&categoria=${encodeURIComponent(item.categoria)}`}
                              className="hover:text-blue-600 dark:hover:text-blue-450 transition-colors cursor-pointer"
                            >
                              🏷️ {item.categoria}
                            </Link>
                          </td>
                          <td className="py-2.5 text-xs font-extrabold text-slate-800 dark:text-zinc-100 text-right">{formatCurrency(item.valor)}</td>
                        </tr>
                      ))}
                    {gastosPorCategoria.filter(item => categoriasRecorrentes.includes(item.categoria)).length === 0 && (
                      <tr>
                        <td colSpan={2} className="py-4 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
                          Nenhum gasto fixo recorrente neste mês.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

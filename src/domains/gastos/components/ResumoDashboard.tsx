'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { calcularRateioMensal, calcularGastosPorCategoria, detectarCategoriasRecorrentes } from '@/lib/calculos'
import { Gasto } from '../types'

interface ResumoDashboardProps {
  gastos: Gasto[]
  percentualRodrigo: number
  percentualGiovana: number
}

export function ResumoDashboard({ gastos, percentualRodrigo, percentualGiovana }: ResumoDashboardProps) {
  const [ano, setAno] = useState(new Date().getFullYear())
  const [mes, setMes] = useState(new Date().getMonth() + 1)

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const anosUnicos = useMemo(() => {
    const anos = new Set(gastos.map(g => new Date(g.data).getFullYear()))
    return Array.from(anos).sort().reverse()
  }, [gastos])

  const gastosParaCalculo = useMemo(() => gastos.map(g => ({
    tipo: g.tipo,
    valor: g.valor,
    data: g.data,
    categoria: g.categoria
  })), [gastos])

  const rateio = useMemo(() =>
    calcularRateioMensal(gastosParaCalculo, percentualRodrigo, percentualGiovana, ano, mes),
    [gastosParaCalculo, percentualRodrigo, percentualGiovana, ano, mes]
  )

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentual = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div>
      {/* Seletor de Mês */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Selecionar Mês</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
            <select
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {anosUnicos.length > 0 ? (
                anosUnicos.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))
              ) : (
                <option value={ano}>{ano}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meses.map((nome, index) => (
                <option key={index + 1} value={index + 1}>{nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Total Compartilhado</h2>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(rateio.totalCompartilhado)}</p>
        </div>

        <div className={`bg-white rounded-lg shadow-md p-6 ${rateio.giovanaDevePagar ? 'border-l-4 border-blue-500' : 'border-l-4 border-red-500'}`}>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">
            {rateio.giovanaDevePagar ? 'Giovana deve pagar' : 'Rodrigo deve pagar'}
          </h2>
          <p className={`text-2xl font-bold ${rateio.giovanaDevePagar ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(Math.abs(rateio.parteGiovana))}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Parte Rodrigo (Informativo)</h2>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(rateio.parteRodrigo)}</p>
        </div>
      </div>

      {/* Configuração de Rateio */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Configuração de Rateio</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Percentual Rodrigo</p>
            <p className="text-xl font-bold">{formatPercentual(percentualRodrigo)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Percentual Giovana</p>
            <p className="text-xl font-bold">{formatPercentual(percentualGiovana)}</p>
          </div>
        </div>
      </div>

      {/* Gráfico de 12 meses */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Total Compartilhado - Últimos 12 Meses</h2>
        {dadosGrafico.every(d => d.total === 0) ? (
          <p className="text-gray-500">Nenhum dado nos últimos 12 meses</p>
        ) : (
          <div className="space-y-3">
            {dadosGrafico.map((item) => (
              <div key={item.mes}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.mes}</span>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.total / maxTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gastos por Categoria */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Gastos por Categoria ({meses[mes - 1]}/{ano})</h2>
        {gastosPorCategoria.length === 0 ? (
          <p className="text-gray-500">Nenhum gasto neste mês</p>
        ) : (
          <div className="space-y-3">
            {gastosPorCategoria.map((item) => (
              <div key={item.categoria}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.categoria}</span>
                  <span className="font-medium">{formatCurrency(item.valor)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categorias Recorrentes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Categorias Recorrentes (≥ 6 meses)</h2>
        {categoriasRecorrentes.length === 0 ? (
          <p className="text-gray-500">Nenhuma categoria recorrente detectada</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categoriasRecorrentes.map((categoria) => (
              <span
                key={categoria}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {categoria}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabela de Gastos Fixos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Gastos Fixos Recorrentes</h2>
        {gastosPorCategoria.length === 0 ? (
          <p className="text-gray-500">Nenhum gasto fixo neste mês</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gastosPorCategoria
                  .filter(item => categoriasRecorrentes.includes(item.categoria))
                  .map((item) => (
                    <tr key={item.categoria}>
                      <td className="px-4 py-3 text-sm">{item.categoria}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(item.valor)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar
        </Link>
      </div>
    </div>
  )
}

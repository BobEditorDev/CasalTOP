'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { deleteGasto } from '../actions'
import { Gasto } from '../types'

interface GastoListProps {
  gastos: Gasto[]
}

export function GastoList({ gastos }: GastoListProps) {
  const [filtros, setFiltros] = useState({
    mes: '',
    categoria: '',
    tipo: ''
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatTipo = (tipo: string) => {
    const tipos: Record<string, string> = {
      'RODRIGO_PAGA': 'Rodrigo Paga',
      'GIOVANA_PAGA': 'Giovana Paga',
      'RODRIGO_PAGOU_DA_GIOVANA': 'Rodrigo Pagou da Giovana',
      'GIOVANA_PAGOU_DO_RODRIGO': 'Giovana Pagou do Rodrigo'
    }
    return tipos[tipo] || tipo
  }

  const gastosFiltrados = gastos.filter(gasto => {
    const data = new Date(gasto.data)
    const mesStr = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`

    const matchMes = !filtros.mes || mesStr === filtros.mes
    const matchCategoria = !filtros.categoria || gasto.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())
    const matchTipo = !filtros.tipo || gasto.tipo === filtros.tipo

    return matchMes && matchCategoria && matchTipo
  })

  const mesesUnicos = Array.from(new Set(gastos.map(gasto => {
    const data = new Date(gasto.data)
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
  }))).sort().reverse()

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este gasto?')) {
      deleteGasto(id)
    }
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
            <select
              value={filtros.mes}
              onChange={(e) => setFiltros(prev => ({ ...prev, mes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {mesesUnicos.map(mes => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <input
              type="text"
              value={filtros.categoria}
              onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
              placeholder="Filtrar categoria..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="RODRIGO_PAGA">Rodrigo Paga</option>
              <option value="GIOVANA_PAGA">Giovana Paga</option>
              <option value="RODRIGO_PAGOU_DA_GIOVANA">Rodrigo Pagou da Giovana</option>
              <option value="GIOVANA_PAGOU_DO_RODRIGO">Giovana Pagou do Rodrigo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Valor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Observação</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gastosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Nenhum lançamento encontrado
                  </td>
                </tr>
              ) : (
                gastosFiltrados.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{formatDate(gasto.data)}</td>
                    <td className="px-4 py-3 text-sm">{gasto.categoria}</td>
                    <td className="px-4 py-3 text-sm">{formatTipo(gasto.tipo)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(gasto.valor)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{gasto.observacao || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleExcluir(gasto.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-center">
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

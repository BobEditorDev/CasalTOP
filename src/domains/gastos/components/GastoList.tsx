'use client'

import React, { useState, useEffect } from 'react'
import { deleteGasto } from '../actions'
import { Gasto } from '../types'
import { GastoRow } from './GastoRow'

interface GastoListProps {
  gastos: Gasto[]
  onDelete?: (id: string) => void
  onRepeat?: (id: string) => void
  onEdit?: (id: string, field: string, newValue: string) => void
  filtroCategoria?: string
}

export function GastoList({ gastos, onDelete, onRepeat, onEdit, filtroCategoria }: GastoListProps) {
  const [filtros, setFiltros] = useState({
    categoria: filtroCategoria || '',
    tipo: ''
  })

  useEffect(() => {
    if (filtroCategoria !== undefined) {
      setFiltros(prev => ({ ...prev, categoria: filtroCategoria }))
    }
  }, [filtroCategoria])

  const gastosFiltrados = gastos.filter(gasto => {
    const matchCategoria = !filtros.categoria || gasto.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())
    const matchTipo = !filtros.tipo || gasto.tipo === filtros.tipo
    return matchCategoria && matchTipo
  })

  const handleExcluirDefault = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
      try {
        await deleteGasto(id)
      } catch (err) {
        console.error('Erro ao deletar gasto:', err)
      }
    }
  }

  const activeDeleteHandler = onDelete || handleExcluirDefault

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de Filtros Rápidos */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-850 rounded-xl">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">Filtrar Lançamentos</span>
        <div className="flex flex-col sm:flex-row gap-2 flex-1 sm:justify-end">
          <input
            type="text"
            value={filtros.categoria}
            onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
            placeholder="Buscar por categoria..."
            className="px-2.5 py-1.5 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-semibold"
          />

          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
            className="px-2.5 py-1.5 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer"
          >
            <option value="">Todos os tipos</option>
            <option value="RODRIGO_PAGA">Rodrigo Paga</option>
            <option value="GIOVANA_PAGA">Giovana Paga</option>
            <option value="RODRIGO_PAGOU_DA_GIOVANA">Rodrigo Pagou da Giovana</option>
            <option value="GIOVANA_PAGOU_DO_RODRIGO">Giovana Pagou do Rodrigo</option>
          </select>
        </div>
      </div>

      {/* Lista / Tabela */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl shadow-xs overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 select-none">
                <th className="px-4 py-3 font-bold">Data</th>
                <th className="px-4 py-3 font-bold">Categoria</th>
                <th className="px-4 py-3 font-bold">Tipo</th>
                <th className="px-4 py-3 font-bold text-right">Valor</th>
                <th className="px-4 py-3 font-bold hidden md:table-cell">Observação</th>
                <th className="px-4 py-3 font-bold text-center w-20">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
              {gastosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    Nenhum lançamento encontrado para este mês.
                  </td>
                </tr>
              ) : (
                gastosFiltrados.map((gasto) => (
                  <GastoRow
                    key={gasto.id}
                    gasto={gasto}
                    onDelete={activeDeleteHandler}
                    onRepeat={onRepeat}
                    onEdit={onEdit}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

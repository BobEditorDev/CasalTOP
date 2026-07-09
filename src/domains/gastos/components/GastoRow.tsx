'use client'

import React from 'react'
import { Gasto } from '../types'
import { InlineEditCell } from '@/shared/ui/InlineEditCell'
import { updateGasto } from '../actions'

interface GastoRowProps {
  gasto: Gasto
  onDelete: (id: string) => void
  onRepeat?: (id: string) => void
  onEdit?: (id: string, field: string, newValue: string) => void
}

export function GastoRow({ gasto, onDelete, onRepeat, onEdit }: GastoRowProps) {
  const handleFieldSave = async (field: string, newValue: string) => {
    if (onEdit) {
      await onEdit(gasto.id, field, newValue)
    } else {
      try {
        const formData = new FormData()
        formData.append(field, newValue)
        await updateGasto(gasto.id, formData)
      } catch (err) {
        console.error(`Erro ao atualizar campo ${field}:`, err)
      }
    }
  }

  const tipoOptions = [
    { value: 'RODRIGO_PAGA', label: '🔵 Rodrigo Paga' },
    { value: 'GIOVANA_PAGA', label: '🟣 Giovana Paga' },
    { value: 'RODRIGO_PAGOU_DA_GIOVANA', label: '🟢 Rodrigo Pagou da Giovana' },
    { value: 'GIOVANA_PAGOU_DO_RODRIGO', label: '🟠 Giovana Pagou do Rodrigo' }
  ]

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/20 transition-all duration-150 group">
      {/* Mês */}
      <td className="px-4 py-3 text-xs text-slate-650 dark:text-zinc-400 font-medium">
        <InlineEditCell
          value={gasto.data}
          type="month"
          onSave={(val) => handleFieldSave('data', val)}
        />
      </td>

      {/* Categoria */}
      <td className="px-4 py-3 text-xs text-slate-800 dark:text-zinc-100 font-bold">
        <div className="flex items-center gap-2">
          <InlineEditCell
            value={gasto.categoria}
            type="text"
            onSave={(val) => handleFieldSave('categoria', val)}
          />
          {gasto.parcelado && (
            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded text-[10px] font-semibold whitespace-nowrap">
              {gasto.parcelaAtual}/{gasto.totalParcelas}
            </span>
          )}
          {gasto.fixo && (
            <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded text-[10px] font-semibold whitespace-nowrap">
              Fixo
            </span>
          )}
        </div>
      </td>

      {/* Tipo */}
      <td className="px-4 py-3 text-xs">
        <div className="inline-block">
          <InlineEditCell
            value={gasto.tipo}
            type="select"
            options={tipoOptions}
            onSave={(val) => handleFieldSave('tipo', val)}
          />
        </div>
      </td>

      {/* Valor */}
      <td className="px-4 py-3 text-xs text-slate-800 dark:text-zinc-100 font-extrabold text-right">
        <InlineEditCell
          value={gasto.valor}
          type="currency"
          onSave={(val) => handleFieldSave('valor', val)}
        />
      </td>

      {/* Observação */}
      <td className="px-4 py-3 text-xs text-slate-500 dark:text-zinc-400 hidden md:table-cell max-w-xs truncate">
        <InlineEditCell
          value={gasto.observacao || ''}
          type="text"
          onSave={(val) => handleFieldSave('observacao', val)}
        />
      </td>

      {/* Ações */}
      <td className="px-4 py-3 text-xs text-center">
        <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
          {onRepeat && (
            <button
              onClick={() => onRepeat(gasto.id)}
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-450 rounded transition-all duration-200 hover:scale-105 cursor-pointer active:scale-95"
              title="Repetir lançamento"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
              </svg>
            </button>
          )}

          <button
            onClick={() => onDelete(gasto.id)}
            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 rounded transition-all duration-200 hover:scale-105 cursor-pointer active:scale-95"
            title="Excluir lançamento"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

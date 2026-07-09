'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createGasto } from '../actions'
import { formatMonthInput } from '@/lib/date-utils'
import { TipoToggle } from './TipoToggle'

type TipoPagamento = 'RODRIGO_PAGA' | 'GIOVANA_PAGA' | 'RODRIGO_PAGOU_DA_GIOVANA' | 'GIOVANA_PAGOU_DO_RODRIGO'

interface QuickAddRowProps {
  distinctCategorias: string[]
  topCategorias: string[]
  usuarioId: string
  onSaveSuccess?: () => void
  year?: number
  month?: number
}

export function QuickAddRow({ distinctCategorias, topCategorias, usuarioId, onSaveSuccess, year, month }: QuickAddRowProps) {
  const router = useRouter()
  const categoriaInputRef = useRef<HTMLInputElement>(null)
  const valorInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    data: (year && month) ? `${year}-${String(month).padStart(2, '0')}` : formatMonthInput(new Date()),
    categoria: '',
    tipo: 'RODRIGO_PAGA' as TipoPagamento,
    valor: '',
    observacao: '',
    parcelado: false,
    totalParcelas: '',
    fixo: false
  })

  const [sugestoes, setSugestoes] = useState<string[]>([])
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessFlash, setShowSuccessFlash] = useState(false)

  // Update date when month or year filter changes
  useEffect(() => {
    if (year && month) {
      const formattedMonth = String(month).padStart(2, '0')
      setFormData(prev => ({
        ...prev,
        data: `${year}-${formattedMonth}`
      }))
    }
  }, [year, month])

  // Listen to keyboard shortcut 'n' globally to focus category input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If we are in an input or textarea, don't trigger
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return
      }

      if (e.key.toLowerCase() === 'n') {
        e.preventDefault()
        categoriaInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCategoriaChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoria: value }))
    if (value.length > 0) {
      const filtradas = distinctCategorias.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
      setSugestoes(filtradas)
      setMostrarSugestoes(true)
    } else {
      setMostrarSugestoes(false)
    }
  }

  const selectCategoria = (cat: string) => {
    setFormData(prev => ({ ...prev, categoria: cat }))
    setMostrarSugestoes(false)
    // Focus value field next
    setTimeout(() => {
      valorInputRef.current?.focus()
    }, 50)
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return (Number(numbers) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '')
    setFormData(prev => ({ ...prev, valor: numbers }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoria.trim() || !formData.valor) return
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('data', formData.data)
      data.append('categoria', formData.categoria.trim())
      data.append('tipo', formData.tipo)
      data.append('valor', formData.valor)
      if (formData.observacao.trim()) {
        data.append('observacao', formData.observacao.trim())
      }
      data.append('usuarioId', usuarioId)
      
      if (formData.parcelado && formData.totalParcelas) {
        data.append('parcelado', 'true')
        data.append('totalParcelas', formData.totalParcelas)
      }
      if (formData.fixo) {
        data.append('fixo', 'true')
      }

      await createGasto(data)

      setFormData(prev => ({
        ...prev,
        data: (year && month) ? `${year}-${String(month).padStart(2, '0')}` : formatMonthInput(new Date()),
        categoria: '',
        valor: '',
        observacao: '',
        parcelado: false,
        totalParcelas: '',
        fixo: false
      }))

      setShowSuccessFlash(true)
      setTimeout(() => setShowSuccessFlash(false), 1000)

      categoriaInputRef.current?.focus()
      if (onSaveSuccess) onSaveSuccess()
      router.refresh()
    } catch (err) {
      console.error('Erro ao adicionar gasto:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl transition-all duration-300 ${
      showSuccessFlash ? 'ring-2 ring-emerald-500 bg-emerald-50/10' : 'shadow-xs'
    }`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Formulário responsivo com Grid melhorado */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          
          {/* PRIMEIRA LINHA: Mês (2), Categoria (6), Valor (4) */}
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mb-1">Mês</label>
            <input
              type="month"
              value={formData.data}
              onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium h-[34px]"
              required
            />
          </div>

          <div className="md:col-span-6 relative">
            <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mb-1">Categoria</label>
            <input
              ref={categoriaInputRef}
              type="text"
              value={formData.categoria}
              onChange={(e) => handleCategoriaChange(e.target.value)}
              onFocus={() => formData.categoria.length > 0 && setMostrarSugestoes(true)}
              onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)}
              placeholder="Mercado, Luz... (Atalho: N)"
              className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-semibold h-[34px]"
              required
              autoComplete="off"
            />

            {mostrarSugestoes && sugestoes.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {sugestoes.map((sugestao) => (
                  <button
                    key={sugestao}
                    type="button"
                    onClick={() => selectCategoria(sugestao)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-700 dark:text-zinc-300 font-medium cursor-pointer"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-4">
            <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mb-1 text-right md:text-left">Valor</label>
            <input
              ref={valorInputRef}
              type="text"
              value={formData.valor ? formatCurrency(formData.valor) : ''}
              onChange={handleValorChange}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-right font-extrabold h-[34px]"
              inputMode="numeric"
              required
            />
          </div>

          {/* SEGUNDA LINHA: Tipo de Pagamento (12 colunas) para evitar botões espremidos */}
          <div className="md:col-span-12">
            <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mb-1">Quem paga / Tipo</label>
            <TipoToggle
              value={formData.tipo}
              onChange={(val) => setFormData(prev => ({ ...prev, tipo: val }))}
            />
          </div>

          {/* TERCEIRA LINHA: Opções (5), Obs (5), Botão (2) */}
          <div className="md:col-span-5 flex gap-4 items-center bg-slate-50 dark:bg-zinc-900/50 px-3 rounded-lg border border-slate-100 dark:border-zinc-800/80 h-[34px]">
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 font-medium cursor-pointer select-none hover:text-slate-900 dark:hover:text-zinc-200 transition-colors">
              <input 
                type="checkbox" 
                checked={formData.parcelado} 
                onChange={e => setFormData(prev => ({...prev, parcelado: e.target.checked, fixo: false}))} 
                className="accent-slate-900 dark:accent-white w-3.5 h-3.5" 
              />
              Parcelado?
            </label>
            
            {formData.parcelado && (
              <input 
                type="number" 
                placeholder="Qtd" 
                value={formData.totalParcelas} 
                onChange={e => setFormData(prev => ({...prev, totalParcelas: e.target.value}))} 
                className="w-14 px-2 py-0.5 border border-slate-200 dark:border-zinc-800 rounded text-[10px] bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-slate-400 font-medium"
                min="2"
                required={formData.parcelado}
              />
            )}

            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 font-medium cursor-pointer select-none hover:text-slate-900 dark:hover:text-zinc-200 transition-colors border-l border-slate-200 dark:border-zinc-800 pl-4">
              <input 
                type="checkbox" 
                checked={formData.fixo} 
                onChange={e => setFormData(prev => ({...prev, fixo: e.target.checked, parcelado: false}))} 
                className="accent-slate-900 dark:accent-white w-3.5 h-3.5" 
              />
              Fixo Mensal?
            </label>
          </div>

          <div className="md:col-span-5">
            <input
              type="text"
              value={formData.observacao}
              onChange={(e) => setFormData(prev => ({ ...prev, observacao: e.target.value }))}
              placeholder="Obs (opcional). Ref. Julho..."
              className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium h-[34px]"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[34px] px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? '...' : 'Lançar'}
            </button>
          </div>
        </div>

        {/* Chips de categorias frequentes */}
        {topCategorias.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 dark:border-zinc-850/50">
            <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-500 mr-1 select-none">Frequentes:</span>
            {topCategorias.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategoria(cat)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-850 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full text-[10px] font-semibold text-slate-600 dark:text-zinc-300 transition-all duration-200 cursor-pointer hover:scale-102"
              >
                🏷️ {cat}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

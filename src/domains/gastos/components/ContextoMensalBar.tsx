'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MonthSelector } from '@/shared/ui/MonthSelector'
import { SummaryCard } from '@/shared/ui/SummaryCard'

interface ContextoMensalBarProps {
  year: number
  month: number
  totalCompartilhado: number
  parteGiovana: number
  parteRodrigo: number
  giovanaDevePagar: boolean
  onMonthChange: (year: number, month: number) => void
  currentTab: 'lancamentos' | 'resumo'
}

export function ContextoMensalBar({
  year,
  month,
  totalCompartilhado,
  parteGiovana,
  parteRodrigo,
  giovanaDevePagar,
  onMonthChange,
  currentTab
}: ContextoMensalBarProps) {
  const router = useRouter()
  const formattedMonth = String(month).padStart(2, '0')
  const queryParam = `?mes=${year}-${formattedMonth}`

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (err) {
      console.error('Erro ao sair:', err)
    }
  }

  return (
    <div className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-850 shadow-xs px-4 py-3">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {/* Topo: Abas, Seletor e Sair */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex bg-slate-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-slate-200/50 dark:border-zinc-800/50">
            <Link
              href={`/${queryParam}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                currentTab === 'lancamentos'
                  ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              Lançamentos
            </Link>
            <Link
              href={`/resumo${queryParam}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                currentTab === 'resumo'
                  ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              Resumo
            </Link>
          </div>

          <MonthSelector year={year} month={month} onChange={onMonthChange} />

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-slate-200 dark:border-zinc-850 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all duration-200 cursor-pointer active:scale-95"
          >
            Sair
          </button>
        </div>

        {/* Cards de Totalizadores */}
        <div className="flex gap-2 w-full">
          <SummaryCard
            label="Total Compartilhado"
            value={totalCompartilhado}
            colorType="neutral"
          />
          <SummaryCard
            label="Parte Giovana (a transferir)"
            value={parteGiovana}
            colorType={giovanaDevePagar ? 'positive' : 'negative'}
          />
          <SummaryCard
            label="Parte Rodrigo (informativo)"
            value={parteRodrigo}
            colorType="interactive"
          />
        </div>
      </div>
    </div>
  )
}

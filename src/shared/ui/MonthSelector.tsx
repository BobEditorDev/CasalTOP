'use client'

import React from 'react'

interface MonthSelectorProps {
  year: number
  month: number // 1-12
  onChange: (year: number, month: number) => void
}

export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const handlePrev = () => {
    if (month === 1) {
      onChange(year - 1, 12)
    } else {
      onChange(year, month - 1)
    }
  }

  const handleNext = () => {
    if (month === 12) {
      onChange(year + 1, 1)
    } else {
      onChange(year, month + 1)
    }
  }

  return (
    <div className="flex items-center space-x-2 bg-slate-100 dark:bg-zinc-800 p-1 rounded-full border border-slate-200/50 dark:border-zinc-700/50 shadow-sm backdrop-blur-md">
      <button
        type="button"
        onClick={handlePrev}
        className="p-1.5 rounded-full hover:bg-white dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
        aria-label="Mês anterior"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span className="text-xs font-semibold text-slate-800 dark:text-zinc-100 min-w-[100px] text-center select-none tracking-wide">
        {meses[month - 1]} {year}
      </span>

      <button
        type="button"
        onClick={handleNext}
        className="p-1.5 rounded-full hover:bg-white dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
        aria-label="Próximo mês"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

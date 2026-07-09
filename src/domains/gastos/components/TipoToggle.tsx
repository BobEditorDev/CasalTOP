'use client'

import React from 'react'

type TipoPagamento = 'RODRIGO_PAGA' | 'GIOVANA_PAGA' | 'RODRIGO_PAGOU_DA_GIOVANA' | 'GIOVANA_PAGOU_DO_RODRIGO'

interface TipoToggleProps {
  value: TipoPagamento
  onChange: (value: TipoPagamento) => void
}

export function TipoToggle({ value, onChange }: TipoToggleProps) {
  const options: Array<{ id: TipoPagamento; label: string; shortLabel: string; bgClass: string; activeClass: string }> = [
    {
      id: 'RODRIGO_PAGA',
      label: 'Rodrigo paga',
      shortLabel: '🔵 R paga',
      bgClass: 'border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 bg-blue-50/20 hover:bg-blue-50/50 dark:bg-blue-950/10 dark:hover:bg-blue-950/20',
      activeClass: 'bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-600'
    },
    {
      id: 'GIOVANA_PAGA',
      label: 'Giovana paga',
      shortLabel: '🟣 G paga',
      bgClass: 'border-violet-200 dark:border-violet-900/40 text-violet-700 dark:text-violet-400 bg-violet-50/20 hover:bg-violet-50/50 dark:bg-violet-950/10 dark:hover:bg-violet-950/20',
      activeClass: 'bg-violet-600 text-white border-violet-600 dark:bg-violet-600 dark:border-violet-600'
    },
    {
      id: 'RODRIGO_PAGOU_DA_GIOVANA',
      label: 'Rodrigo pagou da G.',
      shortLabel: '🟢 R pagou G',
      bgClass: 'border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20',
      activeClass: 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-600'
    },
    {
      id: 'GIOVANA_PAGOU_DO_RODRIGO',
      label: 'Giovana pagou do R.',
      shortLabel: '🟠 G pagou R',
      bgClass: 'border-orange-200 dark:border-orange-900/40 text-orange-700 dark:text-orange-450 bg-orange-50/20 hover:bg-orange-50/50 dark:bg-orange-950/10 dark:hover:bg-orange-950/20',
      activeClass: 'bg-orange-600 text-white border-orange-600 dark:bg-orange-600 dark:border-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 w-full">
      {options.map((opt) => {
        const isActive = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex-1 px-2.5 py-1.5 md:py-2 text-[10px] md:text-xs font-semibold rounded-lg border text-center transition-all duration-200 cursor-pointer select-none active:scale-97 ${
              isActive ? opt.activeClass : opt.bgClass
            }`}
          >
            <span className="hidden md:inline">{opt.label}</span>
            <span className="inline md:hidden">{opt.shortLabel}</span>
          </button>
        )
      })}
    </div>
  )
}

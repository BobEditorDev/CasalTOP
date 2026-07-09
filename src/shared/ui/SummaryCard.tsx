'use client'

import React from 'react'
import { formatCurrency } from '@/lib/date-utils'

interface SummaryCardProps {
  label: string
  value: number
  colorType?: 'positive' | 'negative' | 'neutral' | 'interactive'
  onClick?: () => void
}

export function SummaryCard({ label, value, colorType = 'neutral', onClick }: SummaryCardProps) {
  let colorClasses = 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-850 text-slate-800 dark:text-zinc-150'
  
  if (colorType === 'positive') {
    colorClasses = 'bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-150 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400'
  } else if (colorType === 'negative') {
    colorClasses = 'bg-sky-50/50 dark:bg-sky-950/15 border-sky-150 dark:border-sky-900/40 text-sky-700 dark:text-sky-450'
  } else if (colorType === 'interactive') {
    colorClasses = 'bg-violet-50/50 dark:bg-violet-950/15 border-violet-150 dark:border-violet-900/40 text-violet-700 dark:text-violet-400'
  }

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      className={`flex flex-col flex-1 p-2.5 rounded-xl border transition-all duration-200 text-left ${colorClasses} ${
        onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-99' : ''
      }`}
    >
      <span className="text-[9px] uppercase font-bold tracking-wider opacity-75 mb-0.5 select-none">
        {label}
      </span>
      <span className="text-sm font-extrabold tracking-tight sm:text-base md:text-lg">
        {formatCurrency(value)}
      </span>
    </Component>
  )
}

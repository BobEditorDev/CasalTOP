'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useMonthNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { year, month } = useMemo(() => {
    const mesParam = searchParams.get('mes') // YYYY-MM
    const date = new Date()
    
    if (mesParam && /^\d{4}-\d{2}$/.test(mesParam)) {
      const [y, m] = mesParam.split('-').map(Number)
      return { year: y, month: m }
    }

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1
    }
  }, [searchParams])

  const setMonth = useCallback((newYear: number, newMonth: number) => {
    const formattedMonth = String(newMonth).padStart(2, '0')
    const params = new URLSearchParams(searchParams.toString())
    params.set('mes', `${newYear}-${formattedMonth}`)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const formattedMes = useMemo(() => {
    return `${year}-${String(month).padStart(2, '0')}`
  }, [year, month])

  return {
    year,
    month,
    formattedMes,
    setMonth
  }
}

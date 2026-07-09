/**
 * Utilitários para tratamento de datas sem fuso horário.
 * Evita que new Date('2022-11-01') seja interpretado como UTC
 * e caia no dia anterior em horários de Brasília.
 */

export function parseDateInput(dateString: string): Date {
  const parts = dateString.split('-').map(Number)
  if (parts.length === 2) {
    const [year, month] = parts
    return new Date(year, month - 1, 1, 12, 0, 0)
  }
  const [year, month, day] = parts
  return new Date(year, month - 1, day, 12, 0, 0)
}

export function formatDateInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatMonthInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function isSameMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month - 1
}

export function getStartOfMonth(year: number, month: number): Date {
  return new Date(year, month - 1, 1, 0, 0, 0)
}

export function getEndOfMonth(year: number, month: number): Date {
  return new Date(year, month, 0, 23, 59, 59, 999)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('pt-BR')
}

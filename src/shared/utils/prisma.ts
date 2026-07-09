export function decimalToNumber(decimal: unknown): number {
  if (decimal === null || decimal === undefined) return 0
  if (typeof decimal === 'number') return decimal
  if (typeof decimal === 'object' && decimal !== null && 'toNumber' in decimal && typeof (decimal as { toNumber: () => number }).toNumber === 'function') {
    return (decimal as { toNumber: () => number }).toNumber()
  }
  return Number(decimal) || 0
}

export function decimalToNumberOrNull(decimal: unknown): number | null {
  if (decimal === null || decimal === undefined) return null
  if (typeof decimal === 'number') return decimal
  if (typeof decimal === 'object' && decimal !== null && 'toNumber' in decimal && typeof (decimal as { toNumber: () => number }).toNumber === 'function') {
    return (decimal as { toNumber: () => number }).toNumber()
  }
  const num = Number(decimal)
  return isNaN(num) ? null : num
}
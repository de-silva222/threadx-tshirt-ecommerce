export function formatPrice(amount: number | string | null | undefined, currency = 'LKR'): string {
  const value = Number(amount ?? 0)
  return `${currency} ${value.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function discountPercent(base: number, sale?: number | null): number | null {
  if (!sale || sale >= base) return null
  return Math.round(((base - sale) / base) * 100)
}

import { formatPrice, discountPercent } from '@/utils/format'

export default function PriceDisplay({ base, sale, size = 'md' }: { base: number; sale?: number | null; size?: 'sm' | 'md' | 'lg' }) {
  const pct = discountPercent(base, sale)
  const textSize = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' }[size]

  if (sale && pct) {
    return (
      <div className="flex items-baseline gap-2">
        <span className={`font-bold ${textSize}`}>{formatPrice(sale)}</span>
        <span className="text-ink/40 line-through text-sm">{formatPrice(base)}</span>
        <span className="text-xs font-bold text-red-600">-{pct}%</span>
      </div>
    )
  }
  return <span className={`font-bold ${textSize}`}>{formatPrice(base)}</span>
}

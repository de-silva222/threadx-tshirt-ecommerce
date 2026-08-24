import type { Category } from '@/types'
import { formatPrice } from '@/utils/format'

export interface ShopFilters {
  category?: number
  min_price?: number
  max_price?: number
  min_rating?: number
}

const PRICE_BANDS = [
  { label: 'Under LKR 3,000', min: 0, max: 3000 },
  { label: 'LKR 3,000 – 4,000', min: 3000, max: 4000 },
  { label: 'Over LKR 4,000', min: 4000, max: 999999 },
]

export default function FilterSidebar({
  categories,
  filters,
  onChange,
}: {
  categories: Category[]
  filters: ShopFilters
  onChange: (f: ShopFilters) => void
}) {
  return (
    <aside className="w-full lg:w-56 shrink-0 space-y-8">
      <div>
        <h4 className="section-label mb-3">Category</h4>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onChange({ ...filters, category: filters.category === c.id ? undefined : c.id })}
                className={`text-sm ${filters.category === c.id ? 'font-bold text-accent' : 'text-ink/70 hover:text-ink'}`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="section-label mb-3">Price</h4>
        <ul className="space-y-2">
          {PRICE_BANDS.map((band) => {
            const isActive = filters.min_price === band.min && filters.max_price === band.max
            return (
              <li key={band.label}>
                <button
                  onClick={() => onChange({ ...filters, min_price: isActive ? undefined : band.min, max_price: isActive ? undefined : band.max })}
                  className={`text-sm ${isActive ? 'font-bold text-accent' : 'text-ink/70 hover:text-ink'}`}
                >
                  {band.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <h4 className="section-label mb-3">Rating</h4>
        <ul className="space-y-2">
          {[4, 3].map((r) => (
            <li key={r}>
              <button
                onClick={() => onChange({ ...filters, min_rating: filters.min_rating === r ? undefined : r })}
                className={`text-sm ${filters.min_rating === r ? 'font-bold text-accent' : 'text-ink/70 hover:text-ink'}`}
              >
                {r}★ & up
              </button>
            </li>
          ))}
        </ul>
      </div>

      {(filters.category || filters.min_price !== undefined || filters.min_rating) && (
        <button onClick={() => onChange({})} className="text-xs font-semibold uppercase tracking-widest2 text-ink/50 underline">
          Clear all filters
        </button>
      )}
    </aside>
  )
}

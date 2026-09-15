import { Star } from 'lucide-react'

export default function RatingStars({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(rating) ? 'fill-ink text-ink' : 'fill-none text-ink/20'}
          />
        ))}
      </div>
      {typeof count === 'number' && <span className="text-xs text-ink/50">({count})</span>}
    </div>
  )
}

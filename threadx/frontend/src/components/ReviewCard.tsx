import type { Review } from '@/types'
import RatingStars from './RatingStars'
import { formatDate } from '@/utils/format'

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-ink/10 py-5">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="font-semibold text-sm">{review.user_name}</p>
        <span className="text-xs text-ink/40">{formatDate(review.created_at)}</span>
      </div>
      <RatingStars rating={review.rating} />
      {review.comment && <p className="mt-2 text-sm text-ink/70 leading-relaxed">{review.comment}</p>}
    </div>
  )
}

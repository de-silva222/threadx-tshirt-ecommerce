import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin'
import RatingStars from '@/components/RatingStars'
import { Check, Trash2 } from 'lucide-react'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [filter, setFilter] = useState('pending')

  function load() { adminService.reviews.list(filter).then(setReviews) }
  useEffect(() => { load() }, [filter])

  async function approve(id: number) { await adminService.reviews.approve(id); load() }
  async function remove(id: number) { if (confirm('Delete this review?')) { await adminService.reviews.remove(id); load() } }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-ink/15 bg-white px-3 py-2 text-sm">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start justify-between bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold">{r.user_name} on {r.product_name}</p>
              <RatingStars rating={r.rating} />
              {r.comment && <p className="mt-1 text-sm text-ink/60">{r.comment}</p>}
            </div>
            <div className="flex gap-2">
              {filter === 'pending' && <button onClick={() => approve(r.id)} className="p-2 hover:bg-green-50"><Check size={16} className="text-green-600" /></button>}
              <button onClick={() => remove(r.id)} className="p-2 hover:bg-red-50"><Trash2 size={16} className="text-red-500" /></button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-ink/40">No reviews here.</p>}
      </div>
    </div>
  )
}

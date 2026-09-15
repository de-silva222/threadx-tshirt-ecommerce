import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin'
import { formatPrice } from '@/utils/format'

const STATUSES = ['pending_review', 'approved', 'printing', 'completed', 'rejected']

export default function AdminCustomDesigns() {
  const [designs, setDesigns] = useState<any[]>([])
  const [filter, setFilter] = useState('')

  function load() { adminService.customDesigns.list(filter || undefined).then(setDesigns) }
  useEffect(() => { load() }, [filter])

  async function updateStatus(id: number, status: string) {
    await adminService.customDesigns.updateStatus(id, status)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Custom Designs</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-ink/15 bg-white px-3 py-2 text-sm">
          <option value="">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((d) => (
          <div key={d.id} className="bg-white p-4 shadow-sm">
            <div className="mb-3 h-32 bg-ink/5">
              {d.design_image && <img src={d.design_image} alt="Design" className="h-full w-full object-cover" />}
            </div>
            <p className="text-sm font-medium">{d.tshirt_type} · {d.color} · {d.size}</p>
            <p className="text-xs text-ink/40">Position: {d.print_position}</p>
            {d.custom_text && <p className="text-xs italic text-ink/50">"{d.custom_text}"</p>}
            <p className="mt-1 text-sm font-bold">{formatPrice(d.total_price)}</p>
            <select value={d.status} onChange={(e) => updateStatus(d.id, e.target.value)} className="mt-2 w-full border border-ink/15 px-2 py-1.5 text-xs">
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

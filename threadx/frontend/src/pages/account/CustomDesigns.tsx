import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import type { CustomDesign } from '@/types'
import { formatPrice } from '@/utils/format'
import Badge from '@/components/Badge'
import EmptyState from '@/components/EmptyState'
import { Shirt } from 'lucide-react'

export default function CustomDesigns() {
  const [designs, setDesigns] = useState<CustomDesign[]>([])

  useEffect(() => {
    api.get('/my/custom-designs').then((res) => setDesigns(res.data.data))
  }, [])

  if (designs.length === 0) {
    return <EmptyState icon={<Shirt size={40} />} title="No custom designs yet" description="Designs you create show up here." />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {designs.map((d) => (
        <div key={d.id} className="flex gap-4 border border-ink/10 p-4">
          <div className="h-24 w-20 shrink-0 bg-ink/5">
            {d.design_image && <img src={d.design_image} alt="Custom design" className="h-full w-full object-cover" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{d.tshirt_type} · {d.color} · {d.size}</p>
            <p className="text-xs text-ink/40">Position: {d.print_position}</p>
            <p className="mt-1 text-sm font-bold">{formatPrice(d.total_price)}</p>
            <Badge tone="outline">{d.status.replace('_', ' ')}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

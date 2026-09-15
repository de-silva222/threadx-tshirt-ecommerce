import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '@/services/orders'
import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import Badge from '@/components/Badge'
import { Package } from 'lucide-react'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.myOrders().then(setOrders).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner full />
  if (orders.length === 0) return <EmptyState icon={<Package size={40} />} title="No orders yet" description="Your order history will show up here." />

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {orders.map((o) => (
        <Link key={o.id} to={`/account/orders/${o.order_number}`} className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm hover:bg-ink/5 px-2">
          <div>
            <p className="font-semibold">{o.order_number}</p>
            <p className="text-xs text-ink/40">{formatDate(o.created_at)}</p>
          </div>
          <Badge tone="outline">{o.order_status}</Badge>
          <p className="font-bold">{formatPrice(o.total)}</p>
        </Link>
      ))}
    </div>
  )
}

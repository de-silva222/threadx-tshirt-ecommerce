import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '@/services/orders'
import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from '@/components/LoadingSpinner'
import Badge from '@/components/Badge'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.myOrders().then(setOrders).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner full />

  const pending = orders.filter((o) => !['delivered', 'cancelled'].includes(o.order_status)).length
  const completed = orders.filter((o) => o.order_status === 'delivered').length

  return (
    <div>
      <p className="mb-6 text-sm text-ink/60">Welcome back, {user?.name}.</p>
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="border border-ink/10 p-5"><p className="section-label mb-2">Total Orders</p><p className="font-display text-2xl">{orders.length}</p></div>
        <div className="border border-ink/10 p-5"><p className="section-label mb-2">Pending</p><p className="font-display text-2xl">{pending}</p></div>
        <div className="border border-ink/10 p-5"><p className="section-label mb-2">Completed</p><p className="font-display text-2xl">{completed}</p></div>
      </div>

      <h2 className="mb-4 font-display text-lg uppercase">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-ink/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {orders.slice(0, 5).map((o) => (
            <Link key={o.id} to={`/account/orders/${o.order_number}`} className="flex items-center justify-between py-4 text-sm hover:bg-ink/5 px-2">
              <div>
                <p className="font-semibold">{o.order_number}</p>
                <p className="text-xs text-ink/40">{formatDate(o.created_at)}</p>
              </div>
              <Badge tone="outline">{o.order_status}</Badge>
              <p className="font-bold">{formatPrice(o.total)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

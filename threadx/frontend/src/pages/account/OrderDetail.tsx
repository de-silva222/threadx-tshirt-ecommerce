import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { orderService } from '@/services/orders'
import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'
import LoadingSpinner from '@/components/LoadingSpinner'
import OrderTimeline from '@/components/OrderTimeline'

export default function OrderDetail() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [timeline, setTimeline] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) return
    Promise.all([orderService.getByNumber(orderNumber), orderService.track(orderNumber)])
      .then(([o, t]) => { setOrder(o); setTimeline(t) })
      .finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) return <LoadingSpinner full />
  if (!order) return <p className="text-sm text-ink/50">Order not found.</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl uppercase">{order.order_number}</h2>
        <span className="text-sm text-ink/40">{formatDate(order.created_at)}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest2 text-ink/50">Items</h3>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-xs text-ink/40">{item.color} / {item.size} × {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatPrice(item.line_total)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-ink/50">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink/50">Discount</span><span>-{formatPrice(order.discount)}</span></div>
            <div className="flex justify-between"><span className="text-ink/50">Delivery</span><span>{formatPrice(order.delivery_fee)}</span></div>
            <div className="flex justify-between border-t border-ink/10 pt-2 font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>

          <h3 className="mb-2 mt-8 text-sm font-semibold uppercase tracking-widest2 text-ink/50">Shipping Address</h3>
          <p className="text-sm text-ink/70">{order.first_name} {order.last_name}<br />{order.address_line}, {order.city}, {order.district} {order.postal_code}<br />{order.phone}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest2 text-ink/50">Order Status</h3>
          {timeline && <OrderTimeline timeline={timeline.timeline} cancelled={timeline.cancelled} />}
        </div>
      </div>
    </div>
  )
}

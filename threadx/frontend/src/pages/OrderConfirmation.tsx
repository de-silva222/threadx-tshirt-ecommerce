import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { orderService } from '@/services/orders'
import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'
import LoadingSpinner from '@/components/LoadingSpinner'
import Button from '@/components/Button'

export default function OrderConfirmation() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) return
    orderService.getByNumber(orderNumber).then(setOrder).finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) return <LoadingSpinner full />
  if (!order) return <div className="container-x py-16 text-center">Order not found.</div>

  return (
    <div className="container-x flex flex-col items-center py-16 text-center">
      <CheckCircle2 size={48} className="mb-5 text-green-600" />
      <h1 className="font-display text-3xl uppercase sm:text-4xl">Order Confirmed</h1>
      <p className="mt-2 text-ink/60">Thank you — your order has been placed.</p>

      <div className="mt-8 w-full max-w-md border border-ink/10 p-6 text-left">
        <div className="mb-4 flex justify-between text-sm">
          <span className="text-ink/50">Order Number</span>
          <span className="font-bold">{order.order_number}</span>
        </div>
        <div className="mb-4 flex justify-between text-sm">
          <span className="text-ink/50">Date</span>
          <span>{formatDate(order.created_at)}</span>
        </div>
        <div className="mb-4 flex justify-between text-sm">
          <span className="text-ink/50">Payment Method</span>
          <span className="uppercase">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
        </div>
        <div className="flex justify-between border-t border-ink/10 pt-4 text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link to={`/track-order/${order.order_number}`}><Button variant="secondary">Track Order</Button></Link>
        <Link to="/shop"><Button variant="primary">Continue Shopping</Button></Link>
      </div>
    </div>
  )
}

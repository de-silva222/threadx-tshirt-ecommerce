import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { adminService } from '@/services/admin'
import { formatPrice, formatDate } from '@/utils/format'
import Button from '@/components/Button'
import Input from '@/components/Input'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useUIStore } from '@/store/uiStore'

export default function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [courier, setCourier] = useState('')
  const [tracking, setTracking] = useState('')
  const pushToast = useUIStore((s) => s.pushToast)

  function load() { adminService.orders.get(Number(id)).then((o) => { setOrder(o); setCourier(o.courier_name ?? ''); setTracking(o.tracking_number ?? '') }) }
  useEffect(() => { load() }, [id])

  if (!order) return <LoadingSpinner full />

  async function saveTracking() {
    await adminService.orders.updateTracking(order.id, courier, tracking)
    pushToast('Tracking updated.', 'success')
    load()
  }

  async function updatePayment(status: string) {
    await adminService.orders.updatePaymentStatus(order.id, status)
    load()
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{order.order_number}</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Items</h2>
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between border-b border-ink/5 py-2 text-sm">
                <span>{item.product_name} ({item.color}/{item.size}) × {item.quantity}</span>
                <span className="font-semibold">{formatPrice(item.line_total)}</span>
              </div>
            ))}
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-ink/50">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink/50">Discount</span><span>-{formatPrice(order.discount)}</span></div>
              <div className="flex justify-between"><span className="text-ink/50">Delivery</span><span>{formatPrice(order.delivery_fee)}</span></div>
              <div className="flex justify-between border-t border-ink/10 pt-2 font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Customer &amp; Delivery</h2>
            <p className="text-sm">{order.first_name} {order.last_name} · {order.email} · {order.phone}</p>
            <p className="text-sm text-ink/60">{order.address_line}, {order.city}, {order.district} {order.postal_code}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Payment Status</h2>
            <p className="mb-3 text-sm">Current: <strong>{order.payment_status}</strong></p>
            <div className="flex flex-wrap gap-2">
              {['pending','paid','failed','refunded','cod_pending'].map((s) => (
                                <button key={s} onClick={() => updatePayment(s)} className="border border-ink/15 px-2 py-1 text-xs hover:bg-accent hover:text-white">{s}</button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Tracking</h2>
            <div className="space-y-3">
              <Input label="Courier" value={courier} onChange={(e) => setCourier(e.target.value)} />
              <Input label="Tracking Number" value={tracking} onChange={(e) => setTracking(e.target.value)} />
              <Button className="w-full" onClick={saveTracking}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

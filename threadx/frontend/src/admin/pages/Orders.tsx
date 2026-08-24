import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '@/services/admin'
import { formatPrice, formatDate } from '@/utils/format'
import Badge from '@/components/Badge'
import Select from '@/components/Select'

const ORDER_STATUSES = ['pending','confirmed','processing','printing','packed','shipped','delivered','cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [status, setStatus] = useState('')

  function load() { adminService.orders.list({ status: status || undefined }).then((res) => setOrders(res.items)) }
  useEffect(() => { load() }, [status])

  async function quickUpdateStatus(id: number, newStatus: string) {
    await adminService.orders.updateStatus(id, newStatus)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="w-48">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/40">
            <tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Payment</th><th className="p-4">Status</th><th className="p-4">Date</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-ink/5">
                <td className="p-4"><Link to={`/admin/orders/${o.id}`} className="font-medium hover:text-accent">{o.order_number}</Link></td>
                <td className="p-4">{o.first_name} {o.last_name}</td>
                <td className="p-4 font-semibold">{formatPrice(o.total)}</td>
                <td className="p-4"><Badge tone="outline">{o.payment_status}</Badge></td>
                <td className="p-4">
                  <select value={o.order_status} onChange={(e) => quickUpdateStatus(o.id, e.target.value)} className="border border-ink/15 px-2 py-1 text-xs">
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-ink/50">{formatDate(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

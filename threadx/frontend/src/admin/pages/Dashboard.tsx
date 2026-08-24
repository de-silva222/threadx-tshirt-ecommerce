import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin'
import { formatPrice, formatDate } from '@/utils/format'
import LoadingSpinner from '@/components/LoadingSpinner'
import Badge from '@/components/Badge'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => { adminService.dashboard.overview().then(setData) }, [])

  if (!data) return <LoadingSpinner full />

  const cards = [
    { label: 'Total Sales', value: formatPrice(data.total_sales) },
    { label: 'Orders', value: data.total_orders },
    { label: 'Customers', value: data.total_customers },
    { label: 'Products', value: data.total_products },
    { label: 'Pending Orders', value: data.pending_orders },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-ink/40">{c.label}</p>
            <p className="mt-2 text-xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">Recent Orders</h2>
          <div className="divide-y divide-ink/5">
            {data.recent_orders.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium">{o.order_number}</p>
                  <p className="text-xs text-ink/40">{formatDate(o.created_at)}</p>
                </div>
                <Badge tone="outline">{o.order_status}</Badge>
                <p className="font-semibold">{formatPrice(o.total)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">Best Sellers</h2>
          <div className="divide-y divide-ink/5">
            {data.best_sellers.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                <p className="font-medium">{p.name}</p>
                <p className="text-ink/50">{p.sales_count} sold</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

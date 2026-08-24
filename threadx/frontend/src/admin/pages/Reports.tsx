import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin'
import { formatPrice } from '@/utils/format'
import Select from '@/components/Select'

export default function AdminReports() {
  const [range, setRange] = useState('monthly')
  const [data, setData] = useState<any>(null)

  useEffect(() => { adminService.dashboard.reports(range).then(setData) }, [range])

  const maxTotal = data ? Math.max(...data.sales.map((s: any) => Number(s.total)), 1) : 1

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales Reports</h1>
        <div className="w-40">
          <Select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div>
      </div>

      <div className="bg-white p-6 shadow-sm">
        {data?.sales?.length ? (
          <div className="space-y-3">
            {data.sales.map((s: any) => (
              <div key={s.period} className="flex items-center gap-4">
                <span className="w-24 shrink-0 text-xs text-ink/50">{s.period}</span>
                <div className="h-6 flex-1 bg-ink/5">
                  <div className="h-full bg-accent" style={{ width: `${(Number(s.total) / maxTotal) * 100}%` }} />
                </div>
                <span className="w-28 shrink-0 text-right text-xs font-semibold">{formatPrice(s.total)}</span>
                <span className="w-16 shrink-0 text-right text-xs text-ink/40">{s.orders} orders</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/40">No sales data for this range yet.</p>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin'
import { formatDate } from '@/utils/format'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [q, setQ] = useState('')

  useEffect(() => { adminService.customers.list({ q }).then(setCustomers) }, [q])

  async function toggleStatus(c: any) {
    await adminService.customers.updateStatus(c.id, c.status === 'active' ? 'disabled' : 'active')
    adminService.customers.list({ q }).then(setCustomers)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Customers</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="mb-4 w-64 border border-ink/15 bg-white px-3 py-2 text-sm outline-none" />
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/40">
            <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Joined</th><th className="p-4">Status</th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-ink/5">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4 text-ink/50">{formatDate(c.created_at)}</td>
                <td className="p-4">
                  <button onClick={() => toggleStatus(c)} className={`text-xs font-semibold ${c.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>{c.status}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

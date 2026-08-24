import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { adminService } from '@/services/admin'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Modal from '@/components/Modal'
import { formatDate } from '@/utils/format'
import { useUIStore } from '@/store/uiStore'

const emptyForm = { code: '', type: 'percentage', value: '', min_order_amount: '0', usage_limit: '', per_user_limit: '1', expires_at: '' }

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(emptyForm)
  const pushToast = useUIStore((s) => s.pushToast)

  function load() { adminService.coupons.list().then(setCoupons) }
  useEffect(() => { load() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await adminService.coupons.create({
        ...form,
        value: Number(form.value),
        min_order_amount: Number(form.min_order_amount),
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        per_user_limit: Number(form.per_user_limit),
        expires_at: form.expires_at || null,
      })
      pushToast('Coupon created.', 'success')
      setModalOpen(false); setForm(emptyForm)
      load()
    } catch (err: any) {
      pushToast(err.response?.data?.message ?? 'Could not create coupon.', 'error')
    }
  }

  async function toggleActive(c: any) {
    await adminService.coupons.update(c.id, { is_active: c.is_active ? 0 : 1 })
    load()
  }

  async function remove(id: number) {
    if (!confirm('Delete this coupon?')) return
    await adminService.coupons.remove(id)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Add Coupon</Button>
      </div>
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/40">
            <tr><th className="p-4">Code</th><th className="p-4">Type</th><th className="p-4">Value</th><th className="p-4">Used</th><th className="p-4">Expires</th><th className="p-4">Status</th><th className="p-4"></th></tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-ink/5">
                <td className="p-4 font-mono font-semibold">{c.code}</td>
                <td className="p-4 capitalize">{c.type}</td>
                <td className="p-4">{c.type === 'percentage' ? `${c.value}%` : `LKR ${c.value}`}</td>
                <td className="p-4">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                <td className="p-4 text-ink/50">{c.expires_at ? formatDate(c.expires_at) : '—'}</td>
                <td className="p-4">
                  <button onClick={() => toggleActive(c)} className={`text-xs font-semibold ${c.is_active ? 'text-green-600' : 'text-ink/40'}`}>{c.is_active ? 'Active' : 'Inactive'}</button>
                </td>
                <td className="p-4"><button onClick={() => remove(c.id)}><Trash2 size={14} className="text-red-500" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Coupon">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </Select>
            <Input label="Value" type="number" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min Order Amount" type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} />
            <Input label="Usage Limit" type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Per-User Limit" type="number" value={form.per_user_limit} onChange={(e) => setForm({ ...form, per_user_limit: e.target.value })} />
            <Input label="Expires At" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">Create Coupon</Button>
        </form>
      </Modal>
    </div>
  )
}

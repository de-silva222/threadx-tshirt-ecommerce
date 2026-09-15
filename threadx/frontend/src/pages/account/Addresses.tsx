import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import type { Address } from '@/types'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import { SRI_LANKA_DISTRICTS } from '@/utils/districts'
import { useUIStore } from '@/store/uiStore'
import { Plus, Star, Trash2 } from 'lucide-react'

const emptyForm = { label: 'Home', first_name: '', last_name: '', phone: '', address_line: '', city: '', district: 'Colombo', postal_code: '', is_default: false }

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const pushToast = useUIStore((s) => s.pushToast)

  function load() {
    api.get('/addresses').then((res) => setAddresses(res.data.data))
  }
  useEffect(() => { load() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/addresses', form)
      pushToast('Address saved.', 'success')
      setModalOpen(false)
      setForm(emptyForm)
      load()
    } catch {
      pushToast('Could not save address.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    await api.delete(`/addresses/${id}`)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl uppercase">My Addresses</h2>
        <Button variant="secondary" onClick={() => setModalOpen(true)}><Plus size={14} /> Add Address</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="border border-ink/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest2 text-ink/50">{a.label ?? 'Address'}</p>
              {a.is_default && <span className="flex items-center gap-1 text-xs text-accent"><Star size={12} className="fill-accent" /> Default</span>}
            </div>
            <p className="text-sm font-medium">{a.first_name} {a.last_name}</p>
            <p className="text-sm text-ink/60">{a.address_line}, {a.city}, {a.district} {a.postal_code}</p>
            <p className="text-sm text-ink/60">{a.phone}</p>
            <button onClick={() => remove(a.id)} className="mt-3 flex items-center gap-1 text-xs text-red-600"><Trash2 size={12} /> Remove</button>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Address">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            <Input label="Last Name" required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Address" required value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Select label="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
              {SRI_LANKA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
          <Input label="Postal Code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
            Set as default address
          </label>
          <Button type="submit" className="w-full" loading={saving}>Save Address</Button>
        </form>
      </Modal>
    </div>
  )
}

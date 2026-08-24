import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { adminService } from '@/services/admin'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import Select from '@/components/Select'
import { SRI_LANKA_DISTRICTS } from '@/utils/districts'
import { useUIStore } from '@/store/uiStore'

export default function AdminDelivery() {
  const [rows, setRows] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [district, setDistrict] = useState(SRI_LANKA_DISTRICTS[0])
  const [fee, setFee] = useState('350')
  const pushToast = useUIStore((s) => s.pushToast)

  function load() { adminService.shipping.list().then(setRows) }
  useEffect(() => { load() }, [])

  async function updateFee(id: number, value: string) {
    const feeVal = parseFloat(value)
    if (isNaN(feeVal)) return
    await adminService.shipping.update(id, feeVal)
    load()
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await adminService.shipping.create(district, Number(fee))
    pushToast('Delivery rate added.', 'success')
    setModalOpen(false)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Delivery</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Add District Rate</Button>
      </div>
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/40">
            <tr><th className="p-4">District</th><th className="p-4">Fee (LKR)</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-ink/5">
                <td className="p-4">{r.district}</td>
                <td className="p-4">
                  <input type="number" defaultValue={r.fee} onBlur={(e) => updateFee(r.id, e.target.value)} className="w-24 border border-ink/15 px-2 py-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add District Rate">
        <form onSubmit={submit} className="space-y-4">
          <Select label="District" value={district} onChange={(e) => setDistrict(e.target.value)}>
            {SRI_LANKA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Input label="Fee (LKR)" type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>
    </div>
  )
}

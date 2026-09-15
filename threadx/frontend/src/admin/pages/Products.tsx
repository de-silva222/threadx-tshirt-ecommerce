import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { adminService } from '@/services/admin'
import { formatPrice } from '@/utils/format'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import Select from '@/components/Select'
import { useUIStore } from '@/store/uiStore'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const pushToast = useUIStore((s) => s.pushToast)
  const navigate = useNavigate()

  const emptyForm = { name: '', sku: '', category_id: '', base_price: '', sale_price: '', description: '', material: '', gsm: '', fit: '', is_featured: false, is_active: true }
  const [form, setForm] = useState<any>(emptyForm)

  function load() {
    adminService.products.list({ q }).then((res) => setProducts(res.items))
    adminService.categories.list().then(setCategories)
  }
  useEffect(() => { load() }, [q])

  function openCreate() {
    setForm(emptyForm)
    setModalOpen(true)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = { ...form, category_id: Number(form.category_id), base_price: Number(form.base_price), sale_price: form.sale_price ? Number(form.sale_price) : null }
      const created = await adminService.products.create(payload)
      pushToast('Product created. Now add images and variants.', 'success')
      setModalOpen(false)
      navigate(`/admin/products/${created.id}`)
    } catch (err: any) {
      pushToast(err.response?.data?.message ?? 'Could not save product.', 'error')
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this product?')) return
    await adminService.products.remove(id)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={openCreate}><Plus size={16} /> Add Product</Button>
      </div>

      <div className="mb-4 flex items-center gap-2 bg-white px-3 py-2 shadow-sm">
        <Search size={16} className="text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="flex-1 text-sm outline-none" />
      </div>

      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/40">
            <tr><th className="p-4">Product</th><th className="p-4">SKU</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4"></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink/5">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-ink/50">{p.sku}</td>
                <td className="p-4">{formatPrice(p.sale_price ?? p.base_price)}</td>
                <td className="p-4">{p.is_active ? <span className="text-green-600">Active</span> : <span className="text-ink/40">Inactive</span>}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/admin/products/${p.id}`)}><Pencil size={15} /></button>
                    <button onClick={() => remove(p.id)}><Trash2 size={15} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Product">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="SKU" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <Select label="Category" required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Select…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Base Price" type="number" required value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} />
            <Input label="Sale Price" type="number" value={form.sale_price ?? ''} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Material" value={form.material ?? ''} onChange={(e) => setForm({ ...form, material: e.target.value })} />
            <Input label="GSM" type="number" value={form.gsm ?? ''} onChange={(e) => setForm({ ...form, gsm: e.target.value })} />
            <Input label="Fit" value={form.fit ?? ''} onChange={(e) => setForm({ ...form, fit: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-ink/60">Description</label>
            <textarea rows={3} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-ink/15 px-4 py-3 text-sm outline-none focus:border-ink" />
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          </div>
          <Button type="submit" className="w-full">Create Product</Button>
          <p className="text-center text-xs text-ink/40">You'll add images and size/color variants on the next screen.</p>
        </form>
      </Modal>
    </div>
  )
}
import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Upload, ArrowLeft } from 'lucide-react'
import { adminService } from '@/services/admin'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useUIStore } from '@/store/uiStore'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const IMAGE_TYPES = ['front', 'back', 'detail', 'lifestyle']

export default function AdminProductDetail() {
  const { id } = useParams()
  const productId = Number(id)
  const navigate = useNavigate()
  const pushToast = useUIStore((s) => s.pushToast)

  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageType, setImageType] = useState('front')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const emptyVariant = { size: 'M', color: '', color_hex: '#000000', sku: '', stock: '0' }
  const [variantForm, setVariantForm] = useState<any>(emptyVariant)

  function load() {
    adminService.products.get(productId).then((p) => {
      setProduct(p)
      setForm({ ...p, category_id: String(p.category_id) })
    })
    adminService.categories.list().then(setCategories)
  }
  useEffect(() => { load() }, [productId])

  if (!product || !form) return <LoadingSpinner full />

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        base_price: Number(form.base_price),
        sale_price: form.sale_price ? Number(form.sale_price) : null,
      }
      await adminService.products.update(productId, payload)
      pushToast('Product details saved.', 'success')
      load()
    } catch (err: any) {
      pushToast(err.response?.data?.message ?? 'Could not save product.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await adminService.products.uploadImage(productId, file, imageType)
      pushToast('Image uploaded.', 'success')
      load()
    } catch (err: any) {
      pushToast(err.response?.data?.message ?? 'Upload failed.', 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function addVariant(e: React.FormEvent) {
    e.preventDefault()
    if (!variantForm.color || !variantForm.sku) {
      pushToast('Color and SKU are required.', 'error')
      return
    }
    try {
      await adminService.products.addVariant(productId, {
        ...variantForm,
        stock: Number(variantForm.stock),
      })
      pushToast('Variant added.', 'success')
      setVariantForm(emptyVariant)
      load()
    } catch (err: any) {
      pushToast(err.response?.data?.message ?? 'Could not add variant. SKU may already be in use.', 'error')
    }
  }

  async function updateVariantStock(variantId: number, stock: string) {
    const value = parseInt(stock, 10)
    if (isNaN(value) || value < 0) return
    await adminService.products.updateVariant(variantId, { stock: value })
    load()
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/products')} className="mb-4 flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink">
        <ArrowLeft size={14} /> Back to Products
      </button>
      <h1 className="mb-6 text-2xl font-bold">{product.name}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">Product Details</h2>
          <form onSubmit={saveDetails} className="space-y-3">
            <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="SKU" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              <Select label="Category" required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
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
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            </div>
            <Button type="submit" loading={saving}>Save Changes</Button>
          </form>
        </div>

        <div className="bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">Images</h2>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {(product.images ?? []).map((img: any) => (
              <div key={img.id} className="group relative aspect-square bg-ink/5">
                <img src={img.url} alt={img.type} className="h-full w-full object-cover" />
                <span className="absolute bottom-0 left-0 right-0 bg-black/70 py-0.5 text-center text-[9px] uppercase text-white">{img.type}</span>
                <button
                  onClick={async () => {
                    await adminService.products.deleteImage(img.id)
                    pushToast('Image removed.', 'success')
                    load()
                  }}
                  className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center bg-white/90 group-hover:flex"
                  aria-label="Remove image"
                >
                  <Trash2 size={11} className="text-red-500" />
                </button>
              </div>
            ))}
            {(!product.images || product.images.length === 0) && (
              <p className="col-span-3 text-xs text-ink/40">No images yet.</p>
            )}
          </div>
          <Select label="New image type" value={imageType} onChange={(e) => setImageType(e.target.value)}>
            {IMAGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleImageUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-3 flex w-full flex-col items-center gap-1.5 border-2 border-dashed border-ink/20 py-6 hover:border-ink/40 disabled:opacity-50"
          >
            <Upload size={18} className="text-ink/40" />
            <span className="text-xs font-semibold">{uploading ? 'Uploading…' : 'Click to upload image'}</span>
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">Size &amp; Color Variants</h2>
        <table className="mb-6 w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/40">
            <tr><th className="py-2">SKU</th><th className="py-2">Size</th><th className="py-2">Color</th><th className="py-2">Stock</th></tr>
          </thead>
          <tbody>
            {(product.variants ?? []).map((v: any) => (
              <tr key={v.id} className="border-b border-ink/5">
                <td className="py-2">{v.sku}</td>
                <td className="py-2">{v.size}</td>
                <td className="py-2 flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-ink/10" style={{ backgroundColor: v.color_hex ?? '#ccc' }} />
                  {v.color}
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    defaultValue={v.stock}
                    onBlur={(e) => updateVariantStock(v.id, e.target.value)}
                    className="w-20 border border-ink/15 px-2 py-1"
                  />
                </td>
              </tr>
            ))}
            {(!product.variants || product.variants.length === 0) && (
              <tr><td colSpan={4} className="py-3 text-xs text-ink/40">No variants yet — add sizes/colors below.</td></tr>
            )}
          </tbody>
        </table>

        <form onSubmit={addVariant} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Select label="Size" value={variantForm.size} onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}>
            {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Input label="Color" required value={variantForm.color} onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })} />
          <Input label="Color Hex" type="color" value={variantForm.color_hex} onChange={(e) => setVariantForm({ ...variantForm, color_hex: e.target.value })} />
          <Input label="SKU" required value={variantForm.sku} onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })} />
          <Input label="Stock" type="number" value={variantForm.stock} onChange={(e) => setVariantForm({ ...variantForm, stock: e.target.value })} />
          <div className="col-span-2 sm:col-span-5">
            <Button type="submit"><Plus size={14} /> Add Variant</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Upload } from 'lucide-react'
import { adminService } from '@/services/admin'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import { useUIStore } from '@/store/uiStore'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const pushToast = useUIStore((s) => s.pushToast)

  function load() { adminService.categories.list().then(setCategories) }
  useEffect(() => { load() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.categories.create(name, imageFile)
      pushToast('Category created.', 'success')
      setModalOpen(false); setName(''); setImageFile(null)
      load()
    } catch (err: any) {
      pushToast(err.response?.data?.message ?? 'Could not create category.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(cat: any) {
    await adminService.categories.setActive(cat.id, !cat.is_active)
    load()
  }

  async function remove(id: number) {
    if (!confirm('Delete this category?')) return
    await adminService.categories.remove(id)
    load()
  }

  async function handleImageReplace(catId: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingId(catId)
    try {
      await adminService.categories.updateImage(catId, file)
      pushToast('Category image updated.', 'success')
      load()
    } catch (err: any) {
      pushToast(err.response?.data?.message ?? 'Upload failed.', 'error')
    } finally {
      setUploadingId(null)
      e.target.value = ''
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Add Category</Button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white shadow-sm">
            <div className="group relative aspect-square bg-ink/5">
              {c.image && <img src={c.image} alt={c.name} className="h-full w-full object-cover" />}
              <input
                ref={(el) => { fileInputRefs.current[c.id] = el }}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={(e) => handleImageReplace(c.id, e)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRefs.current[c.id]?.click()}
                disabled={uploadingId === c.id}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 text-transparent transition-colors group-hover:bg-black/50 group-hover:text-white disabled:bg-black/50 disabled:text-white"
              >
                <Upload size={18} />
                <span className="text-xs font-semibold">{uploadingId === c.id ? 'Uploading…' : 'Replace image'}</span>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-sm">{c.name}</p>
                <button onClick={() => remove(c.id)}><Trash2 size={14} className="text-red-500" /></button>
              </div>
              <button onClick={() => toggleActive(c)} className={`text-xs font-semibold ${c.is_active ? 'text-green-600' : 'text-ink/40'}`}>
                {c.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Category">
        <form onSubmit={submit} className="space-y-4">
          <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-ink/60">Image (optional)</label>
            <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="text-sm" />
          </div>
          <Button type="submit" className="w-full" loading={saving}>Create</Button>
        </form>
      </Modal>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { useUIStore } from '@/store/uiStore'

const FIELDS = [
  { key: 'brand_name', label: 'Brand Name' },
  { key: 'accent_color', label: 'Accent Color', type: 'color' },
  { key: 'currency', label: 'Currency' },
  { key: 'default_delivery_fee', label: 'Default Delivery Fee', type: 'number' },
  { key: 'free_delivery_threshold', label: 'Free Delivery Threshold', type: 'number' },
  { key: 'contact_phone', label: 'Contact Phone' },
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'whatsapp_number', label: 'WhatsApp Number' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'tiktok_url', label: 'TikTok URL' },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'custom_printing_fee_text', label: 'Custom Printing Fee (Text)', type: 'number' },
  { key: 'custom_printing_fee_image', label: 'Custom Printing Fee (Image)', type: 'number' },
]

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const pushToast = useUIStore((s) => s.pushToast)

  useEffect(() => { adminService.settings.get().then(setValues) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.settings.update(values)
      pushToast('Settings saved.', 'success')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <form onSubmit={submit} className="max-w-xl space-y-4 bg-white p-6 shadow-sm">
        {FIELDS.map((f) => (
          <Input
            key={f.key}
            label={f.label}
            type={f.type ?? 'text'}
            value={values[f.key] ?? ''}
            onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
          />
        ))}
        <Button type="submit" loading={saving} className="w-full">Save Settings</Button>
      </form>
    </div>
  )
}

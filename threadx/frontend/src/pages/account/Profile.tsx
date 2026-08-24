import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { api } from '@/services/api'
import { useUIStore } from '@/store/uiStore'

export default function Profile() {
  const { user } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const pushToast = useUIStore((s) => s.pushToast)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/me', { name, phone })
      pushToast('Profile updated.', 'success')
    } catch {
      pushToast('Could not update profile.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <h2 className="mb-2 font-display text-xl uppercase">Profile</h2>
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Email" value={user?.email} disabled />
      <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Button type="submit" loading={saving}>Save Changes</Button>
    </form>
  )
}

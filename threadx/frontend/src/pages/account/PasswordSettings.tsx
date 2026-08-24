import { useState } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { api } from '@/services/api'
import { apiErrorMessage } from '@/services/api'
import { useUIStore } from '@/store/uiStore'

export default function PasswordSettings() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const pushToast = useUIStore((s) => s.pushToast)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (next !== confirm) {
      setError('New passwords do not match.')
      return
    }
    setSaving(true)
    try {
      await api.put('/auth/me/password', { current_password: current, new_password: next })
      pushToast('Password updated.', 'success')
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not update password.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <h2 className="mb-2 font-display text-xl uppercase">Password Settings</h2>
      <Input label="Current Password" type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
      <Input label="New Password" type="password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)} />
      <Input label="Confirm New Password" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={saving}>Update Password</Button>
    </form>
  )
}

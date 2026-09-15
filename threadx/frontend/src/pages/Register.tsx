import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { apiErrorMessage } from '@/services/api'
import { brandConfig } from '@/config/brand'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const pushToast = useUIStore((s) => s.pushToast)

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.')
      return
    }
    try {
      await register(form)
      pushToast('Account created. Welcome to the crew.', 'success')
      navigate('/account')
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create your account.'))
    }
  }

  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="section-label mb-2 text-center">{brandConfig.name}</p>
        <h1 className="mb-8 text-center font-display text-3xl uppercase">Create Account</h1>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
          <Input label="Phone" required placeholder="+94 77 123 4567" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          <Input label="Password" type="password" required minLength={8} value={form.password} onChange={(e) => update('password', e.target.value)} />
          <Input label="Confirm Password" type="password" required value={form.confirm_password} onChange={(e) => update('confirm_password', e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" loading={isLoading}>Create Account</Button>
        </form>
        <p className="mt-5 text-center text-xs">
          Already have an account? <Link to="/login" className="underline font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  )
}

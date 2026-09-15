import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { apiErrorMessage } from '@/services/api'
import { brandConfig } from '@/config/brand'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation() as any
  const pushToast = useUIStore((s) => s.pushToast)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      pushToast('Welcome back!', 'success')
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate(location.state?.from ?? '/account')
      }
    } catch (err) {
      setError(apiErrorMessage(err, 'Invalid email or password.'))
    }
  }

  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="section-label mb-2 text-center">{brandConfig.name}</p>
        <h1 className="mb-8 text-center font-display text-3xl uppercase">Log In</h1>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" loading={isLoading}>Log In</Button>
        </form>
        <div className="mt-5 flex justify-between text-xs">
          <Link to="/forgot-password" className="underline text-ink/50">Forgot password?</Link>
          <Link to="/register" className="underline font-semibold">Create an account</Link>
        </div>
      </div>
    </div>
  )
}
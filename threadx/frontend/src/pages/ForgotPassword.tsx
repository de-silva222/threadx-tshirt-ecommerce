import { useState } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { authService } from '@/services/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const msg = await authService.forgotPassword(email)
      setMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center font-display text-3xl uppercase">Reset Password</h1>
        {message ? (
          <p className="text-center text-sm text-ink/60">{message}</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
          </form>
        )}
      </div>
    </div>
  )
}

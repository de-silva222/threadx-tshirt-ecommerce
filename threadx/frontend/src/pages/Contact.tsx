import { useState, useEffect } from 'react'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { settingsService } from '@/services/settings'
import { useUIStore } from '@/store/uiStore'

export default function Contact() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const pushToast = useUIStore((s) => s.pushToast)

  useEffect(() => { settingsService.publicSettings().then(setSettings) }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    // Wire this to a /api/contact endpoint or mail service when ready.
    pushToast('Thanks — we will get back to you shortly.', 'success')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="container-x grid grid-cols-1 gap-12 py-16 lg:grid-cols-2">
      <div>
        <p className="section-label mb-3">Get In Touch</p>
        <h1 className="mb-8 font-display text-4xl uppercase">Contact Us</h1>
        <div className="space-y-4 text-sm">
          {settings.contact_email && <p className="flex items-center gap-3"><Mail size={16} /> {settings.contact_email}</p>}
          {settings.contact_phone && <p className="flex items-center gap-3"><Phone size={16} /> {settings.contact_phone}</p>}
          {settings.whatsapp_number && (
            <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-accent">
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          )}
        </div>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-ink/60">Message</label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-ink/15 px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <Button type="submit" className="w-full">Send Message</Button>
      </form>
    </div>
  )
}

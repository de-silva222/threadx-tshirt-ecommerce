import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ onClose }: { onClose?: () => void }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/shop?q=${encodeURIComponent(q.trim())}`)
      onClose?.()
    }
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-b border-paper/20 px-1 py-2">
      <Search size={18} className="text-paper/50" />
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products, categories, tags…"
        className="flex-1 bg-transparent text-sm text-paper outline-none placeholder:text-paper/40"
      />
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close search">
          <X size={18} className="text-paper/50" />
        </button>
      )}
    </form>
  )
}
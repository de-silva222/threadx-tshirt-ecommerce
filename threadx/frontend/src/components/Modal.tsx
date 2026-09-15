import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-card p-6 shadow-2xl animate-fade-up">
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-display text-lg uppercase">{title}</h3>}
          <button onClick={onClose} aria-label="Close" className="ml-auto text-ink/50 hover:text-ink">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
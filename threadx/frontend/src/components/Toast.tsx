import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

export default function ToastContainer() {
  const { toasts, dismissToast } = useUIStore()

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-up flex items-center gap-3 bg-card text-ink px-4 py-3 shadow-xl min-w-[260px] max-w-sm"
        >
          {t.type === 'success' && <CheckCircle2 size={18} className="text-green-400 shrink-0" />}
          {t.type === 'error' && <XCircle size={18} className="text-red-400 shrink-0" />}
          {t.type === 'info' && <Info size={18} className="text-blue-400 shrink-0" />}
          <p className="text-sm flex-1">{t.message}</p>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss">
            <X size={14} className="text-ink/50 hover:text-ink" />
          </button>
        </div>
      ))}
    </div>
  )
}
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <AlertTriangle size={36} className="text-red-500" />
      <p className="max-w-sm text-sm text-ink/60">{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  )
}

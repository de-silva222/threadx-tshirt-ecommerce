import { Check } from 'lucide-react'

const LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  printing: 'Printing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

export default function OrderTimeline({ timeline, cancelled }: { timeline: { status: string; completed: boolean }[]; cancelled?: boolean }) {
  if (cancelled) {
    return (
      <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        This order was cancelled.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {timeline.map((step, i) => (
        <div key={step.status} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${step.completed ? 'bg-accent text-paper' : 'border border-ink/20 text-ink/30'}`}>
              {step.completed ? <Check size={14} /> : i + 1}
            </div>
            {i < timeline.length - 1 && <div className={`w-px flex-1 ${step.completed ? 'bg-ink' : 'bg-ink/15'}`} style={{ minHeight: 28 }} />}
          </div>
          <p className={`pb-7 pt-0.5 text-sm ${step.completed ? 'font-semibold text-ink' : 'text-ink/40'}`}>{LABELS[step.status] ?? step.status}</p>
        </div>
      ))}
    </div>
  )
}
import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, onChange, max }: { value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div className="inline-flex items-center border border-ink/15">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-10 w-10 items-center justify-center hover:bg-ink/5"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-semibold">{value}</span>
      <button
        onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)}
        className="flex h-10 w-10 items-center justify-center hover:bg-ink/5 disabled:opacity-30"
        aria-label="Increase quantity"
        disabled={max !== undefined && value >= max}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

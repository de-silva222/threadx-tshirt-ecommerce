import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, perPage, total, onChange }: { page: number; perPage: number; total: number; onChange: (page: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <div className="flex items-center justify-center gap-1 py-8">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-ink/30">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`h-9 w-9 text-sm font-semibold ${p === page ? 'bg-accent text-paper' : 'text-ink/60 hover:bg-ink/5'}`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-2 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
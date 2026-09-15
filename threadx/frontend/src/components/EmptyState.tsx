import { ReactNode } from 'react'
import { PackageSearch } from 'lucide-react'

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="text-ink/20">{icon ?? <PackageSearch size={40} />}</div>
      <h3 className="font-display text-xl uppercase">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink/50">{description}</p>}
      {action}
    </div>
  )
}

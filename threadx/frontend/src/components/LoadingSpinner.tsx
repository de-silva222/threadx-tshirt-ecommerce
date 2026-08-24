export default function LoadingSpinner({ full = false }: { full?: boolean }) {
  const spinner = (
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-ink" />
  )
  if (full) {
    return <div className="flex min-h-[40vh] items-center justify-center">{spinner}</div>
  }
  return spinner
}

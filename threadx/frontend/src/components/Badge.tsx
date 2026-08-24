export default function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'accent' | 'sale' | 'outline' }) {
  const styles = {
    default: 'bg-card text-ink',
    accent: 'bg-accent text-white',
    sale: 'bg-red-600 text-white',
    outline: 'border border-ink/20 text-ink',
  }[tone]
  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest2 ${styles}`}>
      {children}
    </span>
  )
}
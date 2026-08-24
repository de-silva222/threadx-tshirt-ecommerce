export default function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-x max-w-2xl py-16">
      <h1 className="mb-8 font-display text-4xl uppercase">{title}</h1>
      <div className="space-y-4 text-sm leading-relaxed text-ink/70">{children}</div>
    </div>
  )
}

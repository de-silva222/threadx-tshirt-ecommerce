const SIZE_DATA = [
  { size: 'S', chest: '48', length: '68' },
  { size: 'M', chest: '52', length: '70' },
  { size: 'L', chest: '56', length: '72' },
  { size: 'XL', chest: '60', length: '74' },
  { size: 'XXL', chest: '64', length: '76' },
]

export default function SizeGuidePage() {
  return (
    <div className="container-x max-w-2xl py-16">
      <h1 className="mb-6 font-display text-4xl uppercase">Size Guide</h1>
      <p className="mb-8 text-sm text-ink/60">Measurements in centimetres, laid flat. Chest measured pit-to-pit x2.</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-widest2 text-ink/50">
            <th className="py-3">Size</th><th className="py-3">Chest (cm)</th><th className="py-3">Length (cm)</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_DATA.map((r) => (
            <tr key={r.size} className="border-b border-ink/5">
              <td className="py-3 font-semibold">{r.size}</td><td className="py-3">{r.chest}</td><td className="py-3">{r.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

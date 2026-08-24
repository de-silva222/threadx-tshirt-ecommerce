import Modal from './Modal'

const SIZE_DATA = [
  { size: 'S', chest: '48', length: '68' },
  { size: 'M', chest: '52', length: '70' },
  { size: 'L', chest: '56', length: '72' },
  { size: 'XL', chest: '60', length: '74' },
  { size: 'XXL', chest: '64', length: '76' },
]

export default function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Size Guide">
      <p className="mb-4 text-sm text-ink/60">Measurements in centimetres. Laid flat, chest measured pit-to-pit x2.</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-widest2 text-ink/50">
            <th className="py-2">Size</th>
            <th className="py-2">Chest (cm)</th>
            <th className="py-2">Length (cm)</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_DATA.map((row) => (
            <tr key={row.size} className="border-b border-ink/5">
              <td className="py-2.5 font-semibold">{row.size}</td>
              <td className="py-2.5">{row.chest}</td>
              <td className="py-2.5">{row.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  )
}

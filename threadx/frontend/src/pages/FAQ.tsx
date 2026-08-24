import StaticPage from './StaticPage'
const FAQS = [
  { q: 'Do you ship islandwide?', a: 'Yes, we deliver to every district in Sri Lanka.' },
  { q: 'Can I pay Cash on Delivery?', a: 'Yes, COD is available at checkout alongside online payment.' },
  { q: 'How long does a custom T-shirt take?', a: 'Custom designs are reviewed and printed within 3-5 business days after approval.' },
]
export default function FAQ() {
  return (
    <StaticPage title="FAQ">
      {FAQS.map((f) => (
        <div key={f.q}>
          <p className="font-semibold text-ink">{f.q}</p>
          <p>{f.a}</p>
        </div>
      ))}
    </StaticPage>
  )
}

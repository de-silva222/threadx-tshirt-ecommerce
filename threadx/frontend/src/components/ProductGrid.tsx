import type { Product } from '@/types'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'

export default function ProductGrid({ products, onQuickView }: { products: Product[]; onQuickView?: (p: Product) => void }) {
  if (products.length === 0) {
    return <EmptyState title="No products found" description="Try adjusting your filters or search terms." />
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  )
}

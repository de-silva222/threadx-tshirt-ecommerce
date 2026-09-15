import { Link } from 'react-router-dom'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import PriceDisplay from './PriceDisplay'
import RatingStars from './RatingStars'
import Badge from './Badge'
import FadeImage from './FadeImage'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { productService } from '@/services/products'
import { useState } from 'react'

export default function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (p: Product) => void }) {
  const { isAuthenticated } = useAuthStore()
  const { has, add, remove } = useWishlistStore()
  const { addVariant } = useCartStore()
  const pushToast = useUIStore((s) => s.pushToast)
  const [hover, setHover] = useState(false)
  const [adding, setAdding] = useState(false)
  const wished = has(product.id)

  const isNew = false // could be computed from created_at; left simple by design

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    if (!isAuthenticated) {
      pushToast('Log in to save items to your wishlist.', 'info')
      return
    }
    try {
      wished ? await remove(product.id) : await add(product.id)
      pushToast(wished ? 'Removed from wishlist.' : 'Added to wishlist.', 'success')
    } catch {
      pushToast('Could not update wishlist.', 'error')
    }
  }

  async function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (adding) return
    setAdding(true)
    try {
      // The product grid doesn't carry variant data, so fetch the full
      // product to find a default in-stock variant to add.
      const full = await productService.getBySlug(product.slug)
      const variant = (full.variants ?? []).find((v) => v.stock > 0)
      if (!variant) {
        pushToast('This product is currently out of stock.', 'error')
        return
      }
      await addVariant(variant.id, 1)
      pushToast(`Added ${full.name} (${variant.color}, ${variant.size}) to cart. Change size in your cart if needed.`, 'success')
    } catch {
      pushToast('Could not add to cart.', 'error')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="img-luxury-frame relative aspect-[4/5] overflow-hidden bg-ink/5">
          {product.image ? (
            <FadeImage
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink/20 text-xs uppercase tracking-widest2">No Image</div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.sale_price && <Badge tone="sale">Sale</Badge>}
            {isNew && <Badge tone="accent">New</Badge>}
          </div>

          <button
            onClick={toggleWishlist}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-card/90 backdrop-blur transition-colors hover:bg-card"
          >
            <Heart size={16} className={wished ? 'fill-accent text-accent' : 'text-ink'} />
          </button>

          <div
            className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 ${hover ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 sm:opacity-0'} max-sm:opacity-100 max-sm:translate-y-0`}
          >
            {onQuickView && (
              <button
                onClick={(e) => { e.preventDefault(); onQuickView(product) }}
                className="flex flex-1 items-center justify-center gap-1.5 bg-card text-ink py-2.5 text-xs font-semibold uppercase tracking-widest2 hover:bg-accent hover:text-white transition-colors"
              >
                <Eye size={14} /> Quick View
              </button>
            )}
            <button
              onClick={quickAdd}
              disabled={adding}
              className="flex flex-1 items-center justify-center gap-1.5 bg-card text-white py-2.5 text-xs font-semibold uppercase tracking-widest2 hover:bg-accent transition-colors disabled:opacity-60"
            >
              <ShoppingBag size={14} /> {adding ? 'Adding…' : 'Add'}
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {product.category_name && <p className="section-label">{product.category_name}</p>}
          <h3 className="font-semibold text-sm leading-snug">{product.name}</h3>
          <RatingStars rating={product.rating_avg} count={product.rating_count} />
          <PriceDisplay base={product.base_price} sale={product.sale_price} />
        </div>
      </Link>
    </div>
  )
}
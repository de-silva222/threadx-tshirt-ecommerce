import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/utils/format'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import FadeImage from '@/components/FadeImage'

export default function Wishlist() {
  const { items, isLoading, refresh, remove } = useWishlistStore()

  useEffect(() => { refresh() }, [])

  if (isLoading) return <LoadingSpinner full />

  if (items.length === 0) {
    return (
      <div className="container-x py-10">
        <EmptyState
          icon={<Heart size={40} />}
          title="Your wishlist is empty"
          description="Save products you love to find them here later."
          action={<Link to="/shop" className="btn-primary mt-2">Browse Products</Link>}
        />
      </div>
    )
  }

  return (
    <div className="container-x py-10">
      <h1 className="mb-8 font-display text-3xl uppercase sm:text-4xl">Wishlist</h1>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.wishlist_item_id} className="group relative">
            <Link to={`/product/${item.slug}`}>
              <div className="img-luxury-frame aspect-[4/5] overflow-hidden bg-ink/5">
                {item.image && <FadeImage src={item.image} alt={item.name} className="h-full w-full object-cover" />}
              </div>
              <p className="mt-3 text-sm font-semibold">{item.name}</p>
              <p className="text-sm font-bold">{formatPrice(item.price)}</p>
            </Link>
            <button
              onClick={() => remove(item.product_id)}
              aria-label="Remove from wishlist"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/90 hover:bg-white"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
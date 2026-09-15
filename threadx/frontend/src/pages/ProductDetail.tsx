import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Ruler, Truck, ShieldCheck } from 'lucide-react'
import { productService } from '@/services/products'
import type { Product, ProductVariant, Review } from '@/types'
import ProductGallery from '@/components/ProductGallery'
import PriceDisplay from '@/components/PriceDisplay'
import RatingStars from '@/components/RatingStars'
import QuantitySelector from '@/components/QuantitySelector'
import SizeGuide from '@/components/SizeGuide'
import ReviewCard from '@/components/ReviewCard'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorState from '@/components/ErrorState'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useNavigate } from 'react-router-dom'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [adding, setAdding] = useState(false)

  const { addVariant } = useCartStore()
  const { has, add: addWish, remove: removeWish } = useWishlistStore()
  const { isAuthenticated } = useAuthStore()
  const pushToast = useUIStore((s) => s.pushToast)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([productService.getBySlug(slug), productService.reviews(slug)])
      .then(([p, r]) => {
        setProduct(p)
        setReviews(r)
        const colors = [...new Set((p.variants ?? []).map((v: ProductVariant) => v.color))]
        if (colors.length) setSelectedColor(colors[0])
      })
      .catch(() => setError('This product could not be found.'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <LoadingSpinner full />
  if (error || !product) return <ErrorState message={error || 'Product not found.'} />

  const variants = product.variants ?? []
  const colors = [...new Set(variants.map((v) => v.color))]
  const availableSizesForColor = variants.filter((v) => v.color === selectedColor).map((v) => v.size)
  const currentVariant = variants.find((v) => v.color === selectedColor && v.size === selectedSize)
  const wished = has(product.id)

  async function handleAddToCart(buyNow = false) {
    if (!selectedSize) {
      pushToast('Please select a size.', 'error')
      return
    }
    if (!currentVariant || currentVariant.stock < 1) {
      pushToast('This size/color combination is out of stock.', 'error')
      return
    }
    setAdding(true)
    try {
      await addVariant(currentVariant.id, quantity)
      pushToast('Added to cart.', 'success')
      if (buyNow) navigate('/cart')
    } catch {
      pushToast('Could not add to cart.', 'error')
    } finally {
      setAdding(false)
    }
  }

  async function toggleWishlist() {
    if (!isAuthenticated) {
      pushToast('Log in to save items to your wishlist.', 'info')
      return
    }
    wished ? await removeWish(product!.id) : await addWish(product!.id)
  }

  return (
    <div className="container-x py-10">
      <p className="mb-6 text-xs text-ink/40">
        <Link to="/shop" className="hover:text-ink">Shop</Link> / {product.category_name} / <span className="text-ink">{product.name}</span>
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images ?? []} productName={product.name} />

        <div>
          <p className="section-label mb-2">{product.category_name}</p>
          <h1 className="font-display text-3xl uppercase sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating_avg} count={product.rating_count} size={16} />
          </div>
          <div className="mt-4">
            <PriceDisplay base={product.base_price} sale={product.sale_price} size="lg" />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink/70">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm">
            {product.material && <><dt className="text-ink/40">Material</dt><dd>{product.material}</dd></>}
            {product.gsm && <><dt className="text-ink/40">GSM</dt><dd>{product.gsm}</dd></>}
            {product.fit && <><dt className="text-ink/40">Fit</dt><dd>{product.fit}</dd></>}
            <dt className="text-ink/40">SKU</dt><dd>{product.sku}</dd>
          </dl>

          {colors.length > 0 && (
            <div className="mt-8">
              <p className="section-label mb-3">Color: <span className="font-semibold text-ink normal-case tracking-normal">{selectedColor}</span></p>
              <div className="flex gap-2">
                {colors.map((color) => {
                  const swatch = variants.find((v) => v.color === color)?.color_hex ?? '#ccc'
                  return (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setSelectedSize('') }}
                      className={`h-9 w-9 rounded-full border-2 ${selectedColor === color ? 'border-ink' : 'border-transparent'}`}
                      style={{ backgroundColor: swatch }}
                      aria-label={color}
                    />
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="section-label">Size</p>
              <button onClick={() => setSizeGuideOpen(true)} className="flex items-center gap-1 text-xs font-semibold underline">
                <Ruler size={12} /> Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const variant = variants.find((v) => v.color === selectedColor && v.size === size)
                const disabled = !variant || variant.stock < 1
                return (
                  <button
                    key={size}
                    disabled={disabled}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 w-14 border text-sm font-semibold transition-colors ${selectedSize === size ? 'border-accent bg-accent text-paper' : 'border-ink/20'} ${disabled ? 'cursor-not-allowed opacity-30 line-through' : 'hover:border-ink'}`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            {currentVariant && currentVariant.stock <= 5 && currentVariant.stock > 0 && (
              <p className="mt-2 text-xs text-red-600">Only {currentVariant.stock} left in stock</p>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} max={currentVariant?.stock} />
            <Button variant="secondary" onClick={toggleWishlist} className="!px-4">
              <Heart size={16} className={wished ? 'fill-accent text-accent' : ''} />
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" className="flex-1" loading={adding} onClick={() => handleAddToCart(false)}>Add to Cart</Button>
            <Button variant="accent" className="flex-1" loading={adding} onClick={() => handleAddToCart(true)}>Buy Now</Button>
          </div>

          <div className="mt-8 space-y-2 border-t border-ink/10 pt-6 text-xs text-ink/50">
            <p className="flex items-center gap-2"><Truck size={14} /> Islandwide delivery, free over LKR 5,000</p>
            <p className="flex items-center gap-2"><ShieldCheck size={14} /> Cash on Delivery &amp; secure online payment</p>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <section className="mt-20 max-w-2xl">
        <h2 className="mb-6 font-display text-2xl uppercase">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-ink/50">No reviews yet. Be the first to review this product after your order is delivered.</p>
        ) : (
          reviews.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </section>

      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  )
}
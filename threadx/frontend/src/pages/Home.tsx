import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shirt, Printer, Truck, ShieldCheck, ArrowRight } from 'lucide-react'
import { productService, categoryService } from '@/services/products'
import type { Product, Category } from '@/types'
import ProductGrid from '@/components/ProductGrid'
import LoadingSpinner from '@/components/LoadingSpinner'
import RatingStars from '@/components/RatingStars'
import FadeImage from '@/components/FadeImage'
import { brandConfig } from '@/config/brand'

const FEATURES = [
  { icon: Shirt, title: 'Premium Fabric', text: 'Comfortable, high-quality fabrics made for everyday wear.' },
  { icon: Printer, title: 'High-Quality Printing', text: 'Durable prints designed to look sharp and last longer.' },
  { icon: Truck, title: 'Islandwide Delivery', text: 'Reliable delivery across Sri Lanka.' },
  { icon: ShieldCheck, title: 'Secure Payments', text: 'Safe and convenient checkout options.' },
]

const TESTIMONIALS = [
  { name: 'Nadeesha P.', rating: 5, text: 'Heavyweight cotton and the print has held up after a dozen washes.', product: 'Midnight Speed Tee' },
  { name: 'Kasun S.', rating: 5, text: 'Best tee I own. Print detail on the back is insane in person.', product: 'JDM Legends Tee' },
  { name: 'Ishara G.', rating: 5, text: 'Worth the limited-drop price. Fit is perfect.', product: 'Limited Drop 001' },
]

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      categoryService.list(),
      productService.list({ sort: 'newest', per_page: 8 }),
      productService.list({ sort: 'best_selling', per_page: 4 }),
    ])
      .then(([cats, arrivals, best]) => {
        setCategories(cats.filter((c) => !['new-arrivals', 'best-sellers'].includes(c.slug)))
        setNewArrivals(arrivals.items)
        setBestSellers(best.items)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navbar text-ink">
        <div className="container-x flex min-h-[78vh] flex-col justify-center py-20 lg:py-0">
          <p className="animate-fade-up section-label text-ink/50 mb-5">{brandConfig.name} · Streetwear Studio</p>
          <h1 className="animate-fade-up font-display text-[13vw] leading-[0.92] uppercase tracking-tightest sm:text-7xl lg:text-8xl" style={{ animationDelay: '80ms' }}>
            Wear What<br />Defines You.
          </h1>
          <p className="animate-fade-up mt-6 max-w-md text-ink/60 text-sm sm:text-base" style={{ animationDelay: '160ms' }}>
            Premium printed T-shirts made for your style.
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
            <Link to="/shop" className="btn-accent">Shop Now <ArrowRight size={16} /></Link>
            <Link to="/custom-tshirt" className="inline-flex items-center justify-center gap-2 border border-ink/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-widest2 text-ink hover:bg-ink hover:text-navbar transition-colors">
              Create Your T-Shirt
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner full />
      ) : (
        <>
          {/* CATEGORIES */}
          <section className="container-x py-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="section-label mb-2">Browse</p>
                <h2 className="font-display text-3xl uppercase sm:text-4xl">Shop By Category</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categories.map((c) => (
                <Link key={c.id} to={`/shop?category=${c.slug}`} className="img-luxury-frame group relative aspect-square overflow-hidden bg-ink/5">
                  {c.image && <FadeImage src={c.image} alt={c.name} className="h-full w-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-sm font-bold uppercase tracking-widest2 text-ink">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* NEW ARRIVALS */}
          <section className="container-x py-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="section-label mb-2">Just Landed</p>
                <h2 className="font-display text-3xl uppercase sm:text-4xl">New Arrivals</h2>
              </div>
              <Link to="/shop?sort=newest" className="hidden text-xs font-semibold uppercase tracking-widest2 underline sm:block">View All</Link>
            </div>
            <ProductGrid products={newArrivals} />
          </section>

          {/* CUSTOM CTA */}
          <section className="my-4 bg-navbar text-ink">
            <div className="container-x flex flex-col items-center gap-6 py-24 text-center">
              <p className="section-label text-ink/50">The Designer</p>
              <h2 className="font-display max-w-2xl text-4xl uppercase leading-tight sm:text-6xl">Your Design. Your T-Shirt.</h2>
              <p className="max-w-md text-ink/60 text-sm sm:text-base">Create a T-shirt that is uniquely yours.</p>
              <Link to="/custom-tshirt" className="btn-accent mt-2">Create Your T-Shirt</Link>
            </div>
          </section>

          {/* BEST SELLERS */}
          <section className="container-x py-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="section-label mb-2">Fan Favourites</p>
                <h2 className="font-display text-3xl uppercase sm:text-4xl">Best Sellers</h2>
              </div>
              <Link to="/shop?sort=best_selling" className="hidden text-xs font-semibold uppercase tracking-widest2 underline sm:block">View All</Link>
            </div>
            <ProductGrid products={bestSellers} />
          </section>

          {/* WHY CHOOSE US */}
          <section className="container-x py-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="tag-corner border border-ink/10 p-6">
                  <f.icon size={24} className="mb-4 text-accent" />
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-widest2">{f.title}</h3>
                  <p className="text-sm text-ink/60">{f.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* REVIEWS */}
          <section className="bg-ink/[0.03] py-20">
            <div className="container-x">
              <p className="section-label mb-2 text-center">Real Talk</p>
              <h2 className="mb-10 text-center font-display text-3xl uppercase sm:text-4xl">Customer Reviews</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="bg-card p-6">
                    <RatingStars rating={t.rating} />
                    <p className="my-4 text-sm leading-relaxed text-ink/70">&ldquo;{t.text}&rdquo;</p>
                    <p className="text-xs font-semibold uppercase tracking-widest2">{t.name}</p>
                    <p className="text-xs text-ink/40">{t.product}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { productService, categoryService } from '@/services/products'
import type { Product, Category } from '@/types'
import ProductGrid from '@/components/ProductGrid'
import FilterSidebar, { type ShopFilters } from '@/components/FilterSidebar'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import Select from '@/components/Select'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'best_selling', label: 'Best Selling' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('featured')
  const [filters, setFilters] = useState<ShopFilters>({})
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const q = searchParams.get('q') ?? undefined

  useEffect(() => {
    categoryService.list().then(setCategories)
  }, [])

  useEffect(() => {
    const catSlug = searchParams.get('category')
    if (catSlug && categories.length) {
      const match = categories.find((c) => c.slug === catSlug)
      if (match) setFilters((f) => ({ ...f, category: match.id }))
    }
    const sortParam = searchParams.get('sort')
    if (sortParam) setSort(sortParam)
  }, [searchParams, categories])

  const load = useCallback(() => {
    setLoading(true)
    productService
      .list({ ...filters, q, sort: sort as any, page, per_page: 12 })
      .then((res) => {
        setProducts(res.items)
        setTotal(res.total)
      })
      .finally(() => setLoading(false))
  }, [filters, q, sort, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [filters, sort, q])

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl uppercase sm:text-4xl">{q ? `Results for "${q}"` : 'Shop All'}</h1>
        <p className="mt-2 text-sm text-ink/50">{loading ? 'Loading…' : `Showing ${products.length} of ${total} Products`}</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden lg:block">
          <FilterSidebar categories={categories} filters={filters} onChange={setFilters} />
        </div>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 text-sm font-semibold lg:hidden">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="ml-auto w-48">
              <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </div>
          </div>

          {loading ? <LoadingSpinner full /> : <ProductGrid products={products} />}
          <Pagination page={page} perPage={12} total={total} onChange={setPage} />
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-navbar p-6">
            <button onClick={() => setMobileFiltersOpen(false)} className="mb-6"><X size={20} /></button>
            <FilterSidebar categories={categories} filters={filters} onChange={setFilters} />
          </div>
        </div>
      )}
    </div>
  )
}
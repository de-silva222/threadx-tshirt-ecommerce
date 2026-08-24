import { api } from './api'
import type { Product, Category } from '@/types'

export interface ProductFilters {
  q?: string
  category?: number
  min_price?: number
  max_price?: number
  min_rating?: number
  featured?: boolean
  sort?: 'featured' | 'newest' | 'best_selling' | 'price_low' | 'price_high' | 'rating'
  page?: number
  per_page?: number
}

export const productService = {
  async list(filters: ProductFilters = {}) {
    const { data } = await api.get<{ success: boolean; data: { items: Product[]; total: number; page: number; per_page: number } }>(
      '/products',
      { params: filters }
    )
    return data.data
  },
  async getBySlug(slug: string) {
    const { data } = await api.get<{ success: boolean; data: Product }>(`/products/${slug}`)
    return data.data
  },
  async reviews(slug: string) {
    const { data } = await api.get(`/products/${slug}/reviews`)
    return data.data
  },
}

export const categoryService = {
  async list() {
    const { data } = await api.get<{ success: boolean; data: Category[] }>('/categories')
    return data.data
  },
}

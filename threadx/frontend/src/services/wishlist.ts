import { api } from './api'
import type { WishlistItem } from '@/types'

export const wishlistService = {
  async list() {
    const { data } = await api.get('/wishlist')
    return data.data as WishlistItem[]
  },
  async add(productId: number) {
    return api.post('/wishlist', { product_id: productId })
  },
  async remove(productId: number) {
    return api.delete(`/wishlist/${productId}`)
  },
}

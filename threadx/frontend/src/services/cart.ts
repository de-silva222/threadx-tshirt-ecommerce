import { api } from './api'
import type { CartItem } from '@/types'

export const cartService = {
  async get() {
    const { data } = await api.get('/cart')
    return data.data as { cart_id: number; items: CartItem[]; saved_for_later: CartItem[]; subtotal: number }
  },
  async addVariant(variantId: number, quantity = 1) {
    return api.post('/cart/items', { variant_id: variantId, quantity })
  },
  async addCustomDesign(designId: number, quantity = 1) {
    return api.post('/cart/items', { custom_design_id: designId, quantity })
  },
  async updateItem(id: number, changes: Partial<{ quantity: number; saved_for_later: boolean }>) {
    return api.put(`/cart/items/${id}`, changes)
  },
  async removeItem(id: number) {
    return api.delete(`/cart/items/${id}`)
  },
  async applyCoupon(code: string) {
    const { data } = await api.post('/cart/apply-coupon', { code })
    return data.data as { code: string; discount: number }
  },
}

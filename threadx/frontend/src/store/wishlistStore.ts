import { create } from 'zustand'
import type { WishlistItem } from '@/types'
import { wishlistService } from '@/services/wishlist'

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  refresh: () => Promise<void>
  add: (productId: number) => Promise<void>
  remove: (productId: number) => Promise<void>
  has: (productId: number) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  refresh: async () => {
    set({ isLoading: true })
    try {
      const items = await wishlistService.list()
      set({ items })
    } catch {
      set({ items: [] })
    } finally {
      set({ isLoading: false })
    }
  },

  add: async (productId) => {
    await wishlistService.add(productId)
    await get().refresh()
  },

  remove: async (productId) => {
    await wishlistService.remove(productId)
    await get().refresh()
  },

  has: (productId) => get().items.some((i) => i.product_id === productId),
}))

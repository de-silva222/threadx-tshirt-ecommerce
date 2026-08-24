import { create } from 'zustand'
import type { CartItem } from '@/types'
import { cartService } from '@/services/cart'

interface CartState {
  items: CartItem[]
  savedForLater: CartItem[]
  subtotal: number
  isLoading: boolean
  refresh: () => Promise<void>
  addVariant: (variantId: number, quantity?: number) => Promise<void>
  addCustomDesign: (designId: number, quantity?: number) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  toggleSaveForLater: (id: number, save: boolean) => Promise<void>
  remove: (id: number) => Promise<void>
  count: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  savedForLater: [],
  subtotal: 0,
  isLoading: false,

  refresh: async () => {
    set({ isLoading: true })
    try {
      const data = await cartService.get()
      set({ items: data.items, savedForLater: data.saved_for_later, subtotal: data.subtotal })
    } finally {
      set({ isLoading: false })
    }
  },

  addVariant: async (variantId, quantity = 1) => {
    await cartService.addVariant(variantId, quantity)
    await get().refresh()
  },

  addCustomDesign: async (designId, quantity = 1) => {
    await cartService.addCustomDesign(designId, quantity)
    await get().refresh()
  },

  updateQuantity: async (id, quantity) => {
    await cartService.updateItem(id, { quantity })
    await get().refresh()
  },

  toggleSaveForLater: async (id, save) => {
    await cartService.updateItem(id, { saved_for_later: save })
    await get().refresh()
  },

  remove: async (id) => {
    await cartService.removeItem(id)
    await get().refresh()
  },

  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))

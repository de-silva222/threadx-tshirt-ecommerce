import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface UIState {
  toasts: Toast[]
  cartDrawerOpen: boolean
  pushToast: (message: string, type?: Toast['type']) => void
  dismissToast: (id: number) => void
  setCartDrawerOpen: (open: boolean) => void
}

let counter = 0

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  cartDrawerOpen: false,
  pushToast: (message, type = 'info') => {
    const id = ++counter
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
}))

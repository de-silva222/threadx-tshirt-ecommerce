import { create } from 'zustand'
import type { User } from '@/types'
import { authService, type RegisterPayload } from '@/services/auth'
import { api } from '@/services/api'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('tx_token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('tx_token'),

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { user, token } = await authService.login(email, password)
      localStorage.setItem('tx_token', token)
      set({ user, token, isAuthenticated: true })
      // Merge any guest cart into the user's cart now that we're logged in.
      const sid = localStorage.getItem('tx_session_id')
      if (sid) await api.post('/cart/merge', { session_id: sid })
      return user
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (payload) => {
    set({ isLoading: true })
    try {
      const { user, token } = await authService.register(payload)
      localStorage.setItem('tx_token', token)
      set({ user, token, isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('tx_token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  hydrate: async () => {
    const token = localStorage.getItem('tx_token')
    if (!token) return
    try {
      const user = await authService.me()
      set({ user, token, isAuthenticated: true })
    } catch {
      localStorage.removeItem('tx_token')
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))
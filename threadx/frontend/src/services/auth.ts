import { api } from './api'
import type { User } from '@/types'

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
  confirm_password: string
}

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post('/auth/register', payload)
    return data.data as { user: User; token: string }
  },
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    return data.data as { user: User; token: string }
  },
  async me() {
    const { data } = await api.get('/auth/me')
    return data.data as User
  },
  async logout() {
    await api.post('/auth/logout')
  },
  async forgotPassword(email: string) {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data.message as string
  },
}

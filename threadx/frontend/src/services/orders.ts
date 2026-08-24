import { api } from './api'
import type { Order } from '@/types'

export interface CheckoutLine {
  type: 'variant' | 'custom'
  id: number
  quantity: number
}

export interface CheckoutPayload {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line: string
  city: string
  district: string
  postal_code?: string
  payment_method: 'cod' | 'online'
  items: CheckoutLine[]
  coupon_code?: string
  notes?: string
  clear_cart?: boolean
}

export const orderService = {
  async create(payload: CheckoutPayload) {
    const { data } = await api.post('/orders', payload)
    return data.data as Order
  },
  async myOrders() {
    const { data } = await api.get('/orders')
    return data.data as Order[]
  },
  async getByNumber(identifier: string) {
    const { data } = await api.get(`/orders/${identifier}`)
    return data.data as Order
  },
  async track(identifier: string) {
    const { data } = await api.get(`/orders/${identifier}/track`)
    return data.data
  },
}

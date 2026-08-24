import { api } from './api'

export const settingsService = {
  async publicSettings() {
    const { data } = await api.get('/settings/public')
    return data.data as Record<string, string>
  },
  async shippingRates() {
    const { data } = await api.get('/shipping')
    return data.data as { district: string; fee: number }[]
  },
}

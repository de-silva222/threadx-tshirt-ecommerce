import { api } from './api'
import type { CustomDesign, CustomDesignPayload } from '@/types'

export const customDesignService = {
  async uploadImage(file: File) {
    const form = new FormData()
    form.append('design', file)
    const { data } = await api.post('/custom-designs/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data.url as string
  },
  async save(payload: CustomDesignPayload) {
    const { data } = await api.post('/custom-designs', payload)
    return data.data as CustomDesign
  },
}

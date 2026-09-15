import { api } from './api'

export const adminService = {
  dashboard: {
    overview: async () => (await api.get('/admin/dashboard')).data.data,
    reports: async (range: string) => (await api.get('/admin/reports', { params: { range } })).data.data,
  },
  products: {
    list: async (params: Record<string, unknown> = {}) => (await api.get('/admin/products', { params })).data.data,
    get: async (id: number) => (await api.get(`/admin/products/${id}`)).data.data,
    create: async (payload: Record<string, unknown>) => (await api.post('/admin/products', payload)).data.data,
    update: async (id: number, payload: Record<string, unknown>) => (await api.put(`/admin/products/${id}`, payload)).data.data,
    remove: async (id: number) => api.delete(`/admin/products/${id}`),
    uploadImage: async (id: number, file: File, type = 'front') => {
      const form = new FormData()
      form.append('image', file)
      form.append('type', type)
      return (await api.post(`/admin/products/${id}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data
    },
    addVariant: async (id: number, payload: Record<string, unknown>) => (await api.post(`/admin/products/${id}/variants`, payload)).data.data,
    updateVariant: async (variantId: number, payload: Record<string, unknown>) => (await api.put(`/admin/variants/${variantId}`, payload)).data.data,
    deleteImage: async (imageId: number) => api.delete(`/admin/products/images/${imageId}`),
  },
  categories: {
    list: async () => (await api.get('/admin/categories')).data.data,
    create: async (name: string, imageFile?: File | null) => {
      const form = new FormData()
      form.append('name', name)
      if (imageFile) form.append('image', imageFile)
      return (await api.post('/admin/categories', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data
    },
    setActive: async (id: number, isActive: boolean) => (await api.put(`/admin/categories/${id}`, { is_active: isActive ? 1 : 0 })).data.data,
    updateImage: async (id: number, imageFile: File) => {
      const form = new FormData()
      form.append('image', imageFile)
      return (await api.post(`/admin/categories/${id}/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data
    },
    remove: async (id: number) => api.delete(`/admin/categories/${id}`),
  },
  orders: {
    list: async (params: Record<string, unknown> = {}) => (await api.get('/admin/orders', { params })).data.data,
    get: async (id: number) => (await api.get(`/admin/orders/${id}`)).data.data,
    updateStatus: async (id: number, status: string, note?: string) => (await api.put(`/admin/orders/${id}/status`, { status, note })).data.data,
    updatePaymentStatus: async (id: number, payment_status: string) => (await api.put(`/admin/orders/${id}/payment-status`, { payment_status })).data.data,
    updateTracking: async (id: number, courier_name: string, tracking_number: string) => (await api.put(`/admin/orders/${id}/tracking`, { courier_name, tracking_number })).data.data,
  },
  customers: {
    list: async (params: Record<string, unknown> = {}) => (await api.get('/admin/customers', { params })).data.data,
    get: async (id: number) => (await api.get(`/admin/customers/${id}`)).data.data,
    updateStatus: async (id: number, status: string) => api.put(`/admin/customers/${id}/status`, { status }),
  },
  customDesigns: {
    list: async (status?: string) => (await api.get('/admin/custom-designs', { params: { status } })).data.data,
    updateStatus: async (id: number, status: string, admin_note?: string) => (await api.put(`/admin/custom-designs/${id}/status`, { status, admin_note })).data.data,
  },
  inventory: {
    list: async () => (await api.get('/admin/inventory')).data.data,
    updateStock: async (variantId: number, stock: number) => (await api.put(`/admin/inventory/${variantId}`, { stock })).data.data,
  },
  coupons: {
    list: async () => (await api.get('/admin/coupons')).data.data,
    create: async (payload: Record<string, unknown>) => (await api.post('/admin/coupons', payload)).data.data,
    update: async (id: number, payload: Record<string, unknown>) => (await api.put(`/admin/coupons/${id}`, payload)).data.data,
    remove: async (id: number) => api.delete(`/admin/coupons/${id}`),
  },
  reviews: {
    list: async (status?: string) => (await api.get('/admin/reviews', { params: { status } })).data.data,
    approve: async (id: number) => api.put(`/admin/reviews/${id}/approve`),
    remove: async (id: number) => api.delete(`/admin/reviews/${id}`),
  },
  shipping: {
    list: async () => (await api.get('/admin/shipping')).data.data,
    update: async (id: number, fee: number) => api.put(`/admin/shipping/${id}`, { fee }),
    create: async (district: string, fee: number) => api.post('/admin/shipping', { district, fee }),
  },
  settings: {
    get: async () => (await api.get('/admin/settings')).data.data,
    update: async (payload: Record<string, string>) => (await api.put('/admin/settings', payload)).data.data,
  },
}
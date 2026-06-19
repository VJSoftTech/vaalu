import api from './api'
import type { Category } from '@/types'

export const categoryService = {
  getAll: () => api.get<Category[]>('/api/categories').then((r) => r.data),

  create: (data: { name: string; slug: string }) =>
    api.post<Category>('/api/categories', data).then((r) => r.data),

  update: (id: number, data: { name: string; slug: string }) =>
    api.put<Category>(`/api/categories/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/categories/${id}`).then((r) => r.data),
}

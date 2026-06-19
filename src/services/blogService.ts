import api from './api'
import type { Blog, PaginatedResponse } from '@/types'

export const blogService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) =>
    api.get<PaginatedResponse<Blog>>('/api/blogs', { params }).then((r) => r.data),

  getById: (id: number) => api.get<Blog>(`/api/blogs/${id}`).then((r) => r.data),

  getBySlug: (slug: string) => api.get<Blog>(`/api/blogs/slug/${slug}`).then((r) => r.data),

  create: (data: FormData | Partial<Blog>) =>
    api.post<Blog>('/api/blogs', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }).then((r) => r.data),

  update: (id: number, data: FormData | Partial<Blog>) =>
    api.put<Blog>(`/api/blogs/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/blogs/${id}`).then((r) => r.data),
}

import api from './api'
import type { Author, PaginatedResponse } from '@/types'

export const authorService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Author>>('/api/authors', { params }).then((r) => r.data),

  getById: (id: number) => api.get<Author>(`/api/authors/${id}`).then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Author>('/api/authors', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  update: (id: number, formData: FormData) =>
    api.put<Author>(`/api/authors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/authors/${id}`).then((r) => r.data),
}

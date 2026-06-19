import api from './api'
import type { Advertisement, PaginatedResponse } from '@/types'

export const advertisementService = {
  getAll: (params?: { page?: number; limit?: number; is_active?: boolean }) =>
    api
      .get<PaginatedResponse<Advertisement>>('/api/advertisements', { params })
      .then((r) => r.data),

  getById: (id: number) =>
    api.get<Advertisement>(`/api/advertisements/${id}`).then((r) => r.data),

  create: (formData: FormData) =>
    api
      .post<Advertisement>('/api/advertisements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  update: (id: number, formData: FormData) =>
    api
      .put<Advertisement>(`/api/advertisements/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  delete: (id: number) => api.delete(`/api/advertisements/${id}`).then((r) => r.data),
}

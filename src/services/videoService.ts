import api from './api'
import type { Video, VideoFormData, PaginatedResponse } from '@/types'

export const videoService = {
  getAll: (params?: { page?: number; limit?: number; category?: string; is_featured?: boolean }) =>
    api.get<PaginatedResponse<Video>>('/api/videos', { params }).then((r) => r.data),

  getById: (id: number) => api.get<Video>(`/api/videos/${id}`).then((r) => r.data),

  create: (data: VideoFormData) => api.post<Video>('/api/videos', data).then((r) => r.data),

  update: (id: number, data: Partial<VideoFormData>) =>
    api.put<Video>(`/api/videos/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/videos/${id}`).then((r) => r.data),
}

import api from './api'
import type { Announcement } from '@/types'

export const announcementService = {
  getAll: () =>
    api.get<{ data: Announcement[]; total: number }>('/api/announcements').then((r) => r.data),

  getActive: (userId?: number) =>
    api.get<{ data: Announcement[]; total: number }>('/api/announcements', {
      params: { active: 'true', ...(userId ? { user_id: userId } : {}) },
    }).then((r) => r.data),

  getById: (id: number) => api.get<Announcement>(`/api/announcements/${id}`).then((r) => r.data),

  getUnreadCount: (userId: number) =>
    api.get<{ count: number }>('/api/announcements/unread-count', { params: { user_id: userId } })
      .then((r) => r.data.count),

  markRead: (id: number, userId: number) =>
    api.post(`/api/announcements/${id}/read`, { user_id: userId }).then((r) => r.data),

  markAllRead: (userId: number) =>
    api.post('/api/announcements/read-all', { user_id: userId }).then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Announcement>('/api/announcements', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  update: (id: number, formData: FormData) =>
    api.put<Announcement>(`/api/announcements/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/announcements/${id}`).then((r) => r.data),
}

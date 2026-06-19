import api from './api'
import type { GiftItem, GiftEnquiry, GiftFilters, PaginatedResponse } from '@/types'

function normalizeGift(g: GiftItem): GiftItem {
  return {
    ...g,
    gallery: Array.isArray(g.gallery) ? g.gallery : [],
  }
}

export const giftService = {
  getAll: (filters?: GiftFilters) =>
    api.get<PaginatedResponse<GiftItem>>('/api/gifts', { params: filters })
      .then((r) => ({ ...r.data, data: r.data.data.map(normalizeGift) })),

  getFeatured: (limit = 8) =>
    api.get<{ data: GiftItem[]; total: number }>('/api/gifts/featured', { params: { limit } })
      .then((r) => ({ ...r.data, data: r.data.data.map(normalizeGift) })),

  getTrending: (limit = 8) =>
    api.get<{ data: GiftItem[]; total: number }>('/api/gifts/trending', { params: { limit } })
      .then((r) => ({ ...r.data, data: r.data.data.map(normalizeGift) })),

  getBySlug: (slug: string) =>
    api.get<GiftItem>(`/api/gifts/slug/${slug}`).then((r) => normalizeGift(r.data)),

  getById: (id: number) =>
    api.get<GiftItem>(`/api/gifts/${id}`).then((r) => normalizeGift(r.data)),

  create: (formData: FormData) =>
    api.post<GiftItem>('/api/gifts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => normalizeGift(r.data)),

  update: (id: number, formData: FormData) =>
    api.put<GiftItem>(`/api/gifts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => normalizeGift(r.data)),

  delete: (id: number) =>
    api.delete(`/api/gifts/${id}`).then((r) => r.data),

  submitEnquiry: (data: { customer_name: string; phone_number?: string; email?: string; gift_id?: number; message?: string }) =>
    api.post('/api/gifts/enquiry', data).then((r) => r.data),

  getEnquiries: () =>
    api.get<{ data: GiftEnquiry[]; total: number }>('/api/gifts/enquiries').then((r) => r.data),
}

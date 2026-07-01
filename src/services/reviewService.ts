import api from './api'
import type { Review, ReviewFormData } from '@/types'

export const reviewService = {
  getByBook: (bookId: number) =>
    api.get<{ data: Review[] }>(`/api/books/${bookId}/reviews`).then((r) => r.data.data),

  create: (bookId: number, data: ReviewFormData) =>
    api.post<Review>(`/api/books/${bookId}/reviews`, data).then((r) => r.data),

  getAll: () => api.get<{ data: Review[] }>('/api/reviews').then((r) => r.data.data),

  delete: (id: number) => api.delete(`/api/reviews/${id}`).then((r) => r.data),
}

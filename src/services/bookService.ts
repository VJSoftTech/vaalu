import api from './api'
import type { Book, BookFilters, PaginatedResponse } from '@/types'

function normalizeBooksResponse(raw: unknown): PaginatedResponse<Book> {
  if (Array.isArray(raw)) {
    return { data: raw, total: raw.length, page: 1, limit: raw.length, total_pages: 1 }
  }
  const r = raw as Record<string, unknown>
  // handle { books: [], count: N } or { items: [], total: N } etc.
  const data = (r.data ?? r.books ?? r.items ?? []) as Book[]
  const total = (r.total ?? r.count ?? r.totalCount ?? data.length) as number
  const page = (r.page ?? r.currentPage ?? 1) as number
  const limit = (r.limit ?? r.perPage ?? data.length) as number
  const total_pages = (r.total_pages ?? r.totalPages ?? Math.ceil(total / (limit || 1))) as number
  return { data, total, page, limit, total_pages }
}

export const bookService = {
  getAll: (filters?: BookFilters) =>
    api.get('/api/books', { params: filters }).then((r) => normalizeBooksResponse(r.data)),

  getById: (id: number) => api.get<Book>(`/api/books/${id}`).then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Book>('/api/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  update: (id: number, formData: FormData) =>
    api.put<Book>(`/api/books/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/books/${id}`).then((r) => r.data),
}

import api from './api'
import type { Order, OrderFilters, PaginatedResponse, OrderStatus, PaymentStatus } from '@/types'

export const orderService = {
  getAll: (filters?: OrderFilters) =>
    api.get<PaginatedResponse<Order>>('/api/orders', { params: filters }).then((r) => r.data),

  getById: (id: number) => api.get<Order>(`/api/orders/${id}`).then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Order>('/api/orders', formData).then((r) => r.data),

  updateStatus: (id: number, data: { order_status?: OrderStatus; payment_status?: PaymentStatus }) =>
    api.put<Order>(`/api/orders/${id}`, data).then((r) => r.data),
}

import api from './api'
import type { Order, OrderFilters, PaginatedResponse, OrderStatus } from '@/types'

export const orderService = {
  getAll: (filters?: OrderFilters) =>
    api.get<PaginatedResponse<Order>>('/api/orders', { params: filters }).then((r) => r.data),

  getById: (id: number) => api.get<Order>(`/api/orders/${id}`).then((r) => r.data),

  updateStatus: (id: number, status: OrderStatus) =>
    api.put<Order>(`/api/orders/${id}/status`, { status }).then((r) => r.data),
}

import api from './api'
import type { Customer, CustomerFilters, PaginatedResponse } from '@/types'

export const customerService = {
  getAll: (filters?: CustomerFilters) =>
    api.get<PaginatedResponse<Customer>>('/api/customers', { params: filters }).then((r) => r.data),

  getById: (id: number) => api.get<Customer>(`/api/customers/${id}`).then((r) => r.data),
}

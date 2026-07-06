import api from './api'
import type { Customer, CustomerFilters, PaginatedResponse } from '@/types'

export interface CustomerFormData {
  name: string
  email: string
  mobile_number: string
  password?: string
}

export const customerService = {
  getAll: (filters?: CustomerFilters) =>
    api.get<PaginatedResponse<Customer>>('/api/customers', { params: filters }).then((r) => r.data),

  getById: (id: number) => api.get<Customer>(`/api/customers/${id}`).then((r) => r.data),

  create: (data: CustomerFormData) =>
    api.post<Customer>('/api/customers', data).then((r) => r.data),

  update: (id: number, data: Partial<CustomerFormData>) =>
    api.put<Customer>(`/api/customers/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/api/customers/${id}`).then((r) => r.data),
}

import api from './api'

export interface SalesReport {
  date: string
  orders: number
  revenue: number
}

export interface PopularBook {
  id: number
  title: string
  cover_image: string
  total_sold: number
  revenue: number
}

export interface CustomerReport {
  total_customers: number
  new_this_month: number
  top_customers: { id: number; name: string; total_spent: number; orders: number }[]
}

export const reportService = {
  getSales: (params?: { from?: string; to?: string }) =>
    api.get<SalesReport[]>('/api/reports/sales', { params }).then((r) => r.data),

  getRevenue: (params?: { period?: 'daily' | 'weekly' | 'monthly' | 'yearly' }) =>
    api.get('/api/reports/revenue', { params }).then((r) => r.data),

  getPopularBooks: () => api.get<PopularBook[]>('/api/reports/popular-books').then((r) => r.data),

  getCustomers: () => api.get<CustomerReport>('/api/reports/customers').then((r) => r.data),
}

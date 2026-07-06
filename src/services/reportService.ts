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

export interface RevenuePoint {
  date: string
  revenue: number
}

export interface DashboardStats {
  total_orders: number
  total_books: number
  total_customers: number
  total_revenue: number
  orders_trend: number
  customers_trend: number
  revenue_trend: number
}

export interface ReportFilters {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  from?: string
  to?: string
}

export const reportService = {
  getSales: (params?: ReportFilters) =>
    api.get<SalesReport[]>('/api/reports/sales', { params }).then((r) => r.data),

  getRevenue: (params?: ReportFilters) =>
    api.get<RevenuePoint[]>('/api/reports/revenue', { params }).then((r) => r.data),

  getPopularBooks: () => api.get<PopularBook[]>('/api/reports/popular-books').then((r) => r.data),

  getCustomers: () => api.get<CustomerReport>('/api/reports/customers').then((r) => r.data),

  getDashboardStats: () => api.get<DashboardStats>('/api/dashboard/stats').then((r) => r.data),
}

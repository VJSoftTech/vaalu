export interface Customer {
  id: number
  name: string
  email: string
  mobile_number: string
  orders_count?: number
  total_spent?: number
  created_at?: string
}

export interface CustomerFilters {
  search?: string
  page?: number
  limit?: number
}

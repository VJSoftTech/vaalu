export interface Book {
  id: number
  title: string
  author_id: number
  author_name?: string
  category_id: number
  category_name?: string
  isbn: string
  description: string
  price: number
  discount_price: number | null
  stock_quantity: number
  cover_image: string
  preview_pdf: string | null
  rating: number
  created_at: string
}

export interface BookFormData {
  title: string
  author_id: number
  category_id: number
  isbn: string
  description: string
  price: number
  discount_price?: number
  stock_quantity: number
  cover_image?: string
  preview_pdf?: string
  rating?: number
}

export interface BookFilters {
  search?: string
  category_id?: number
  author_id?: number
  min_price?: number
  max_price?: number
  sort_by?: 'title' | 'price' | 'rating' | 'created_at'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

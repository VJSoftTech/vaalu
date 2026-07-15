export interface Book {
  id: number
  title: string
  subtitle?: string
  author_id: number
  author_name?: string
  authors?: { id: number; name: string }[]
  editors?: { name: string }[]
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
  external_url?: string
  publisher?: string
  total_pages?: number | null
  print_type?: string
  publication_year?: number | null
  edition?: string
  publisher_serial_number?: string
  created_at: string
}

export interface BookFormData {
  title: string
  subtitle?: string
  author_id?: number
  co_author_ids?: number[]
  editor_names?: string[]
  category_id: number
  isbn: string
  description: string
  price: number
  discount_price?: number
  stock_quantity: number
  cover_image?: string
  preview_pdf?: string
  rating?: number
  external_url?: string
  publisher?: string
  total_pages?: number
  print_type?: string
  publication_year?: number
  edition?: string
  publisher_serial_number?: string
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

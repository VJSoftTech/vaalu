export interface Review {
  id: number
  book_id: number
  customer_name: string
  customer_email?: string
  rating: number
  comment: string
  created_at: string
  book_title?: string
}

export interface ReviewFormData {
  customer_name: string
  customer_email?: string
  rating: number
  comment: string
}

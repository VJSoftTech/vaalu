export * from './auth.types'
export * from './book.types'
export * from './author.types'
export * from './blog.types'
export * from './order.types'
export * from './customer.types'
export * from './video.types'
export * from './advertisement.types'
export * from './gift.types'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

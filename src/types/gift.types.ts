export interface GiftItem {
  id: number
  title: string
  slug: string
  short_description?: string
  description: string
  category: string
  cover_image: string
  gallery: string[]
  video_url: string
  is_featured: boolean
  is_trending: boolean
  is_active: boolean
  display_order?: number
  created_at: string
  updated_at: string
}

export interface GiftEnquiry {
  id: number
  customer_name: string
  phone_number: string
  email: string
  gift_id: number | null
  gift_title?: string
  message: string
  status: string
  created_at: string
}

export interface GiftFilters {
  search?: string
  category?: string
  page?: number
  limit?: number
}

export interface GiftFormData {
  title: string
  description: string
  category: string
  video_url?: string
  is_featured: boolean
  is_trending: boolean
  is_active: boolean
}

export const GIFT_CATEGORIES = [
  'Gift Currency Notes',
  'Birthday Calendar Gifts',
  'Wedding Anniversary Calendars',
  'Festival Gifts',
  'Corporate Gifts',
  'Custom Gifts',
] as const

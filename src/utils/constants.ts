export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const ORDER_STATUSES = [
  'placed',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const

export const AD_TYPES = ['banner', 'festival', 'countdown', 'gift'] as const

export const GST_RATE = 0.05
export const FREE_SHIPPING_THRESHOLD = 500
export const SHIPPING_CHARGE = 60

export const ITEMS_PER_PAGE = 15
export const ADMIN_ITEMS_PER_PAGE = 10

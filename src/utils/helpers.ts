import { GST_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_CHARGE } from './constants'

export const calculateDiscount = (price: number, discountPrice: number | null): number => {
  if (!discountPrice) return 0
  return Math.round(((price - discountPrice) / price) * 100)
}

export const calculateCartTotals = (subtotal: number) => {
  const gst = subtotal * GST_RATE
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE
  return {
    subtotal,
    gst: Math.round(gst),
    shipping,
    total: Math.round(subtotal + gst + shipping),
  }
}

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `VP-${timestamp}-${random}`
}

export const isAdActive = (startDate: string, endDate: string): boolean => {
  const now = new Date()
  return new Date(startDate) <= now && now <= new Date(endDate)
}

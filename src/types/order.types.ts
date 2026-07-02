export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'online' | 'qr'
export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface ShippingAddress {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pincode: string
  phone: string
}

export interface OrderItem {
  id: number
  order_id: number
  book_id: number
  book_title?: string
  book_cover?: string
  quantity: number
  unit_price: number
}

export interface Order {
  id: number
  customer_id: number
  customer_name?: string
  customer_email?: string
  order_number: string
  subtotal: number
  gst_amount: number
  shipping_amount: number
  total_amount: number
  payment_status: PaymentStatus
  payment_method?: PaymentMethod
  payment_ref_id?: string
  payment_attachment?: string
  order_status: OrderStatus
  shipping_address?: ShippingAddress
  items?: OrderItem[]
  created_at: string
  updated_at?: string
}

export interface OrderFilters {
  search?: string
  payment_status?: PaymentStatus
  order_status?: OrderStatus
  from_date?: string
  to_date?: string
  page?: number
  limit?: number
}

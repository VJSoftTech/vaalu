import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Book } from '@/types'
import { calculateCartTotals } from '@/utils/helpers'

export interface CartItem {
  book: Book
  quantity: number
}

interface CartStore {
  items: CartItem[]
  couponCode: string | null
  discount: number
  addItem: (book: Book) => void
  removeItem: (bookId: number) => void
  updateQuantity: (bookId: number, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  getTotals: () => ReturnType<typeof calculateCartTotals>
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addItem: (book) =>
        set((state) => {
          const existing = state.items.find((i) => i.book.id === book.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            }
          }
          return { items: [...state.items, { book, quantity: 1 }] }
        }),

      removeItem: (bookId) =>
        set((state) => ({ items: state.items.filter((i) => i.book.id !== bookId) })),

      updateQuantity: (bookId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.book.id !== bookId)
              : state.items.map((i) => (i.book.id === bookId ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [], couponCode: null, discount: 0 }),

      applyCoupon: (code, discount) => set({ couponCode: code, discount }),

      removeCoupon: () => set({ couponCode: null, discount: 0 }),

      getTotals: () => {
        const subtotal = get().items.reduce(
          (sum, i) => sum + (i.book.discount_price ?? i.book.price) * i.quantity,
          0,
        )
        return calculateCartTotals(subtotal - get().discount)
      },

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'vpms-cart' },
  ),
)

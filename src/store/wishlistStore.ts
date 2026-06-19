import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Book } from '@/types'

interface WishlistStore {
  items: Book[]
  addItem: (book: Book) => void
  removeItem: (bookId: number) => void
  toggleItem: (book: Book) => void
  isInWishlist: (bookId: number) => boolean
  getItemCount: () => number
  clearAll: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book) =>
        set((state) => {
          if (state.items.some((i) => i.id === book.id)) return state
          return { items: [...state.items, book] }
        }),

      removeItem: (bookId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== bookId) })),

      toggleItem: (book) => {
        const exists = get().items.some((i) => i.id === book.id)
        if (exists) get().removeItem(book.id)
        else get().addItem(book)
      },

      isInWishlist: (bookId) => get().items.some((i) => i.id === bookId),

      getItemCount: () => get().items.length,

      clearAll: () => set({ items: [] }),
    }),
    { name: 'vpms-wishlist' },
  ),
)

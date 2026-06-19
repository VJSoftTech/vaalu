import { useCartStore } from '@/store'
import type { Book } from '@/types'

export const useCart = () => {
  const store = useCartStore()

  const isInCart = (bookId: number) => store.items.some((i) => i.book.id === bookId)

  const getQuantity = (bookId: number) =>
    store.items.find((i) => i.book.id === bookId)?.quantity ?? 0

  const addToCart = (book: Book) => store.addItem(book)

  return {
    items: store.items,
    itemCount: store.getItemCount(),
    totals: store.getTotals(),
    couponCode: store.couponCode,
    isInCart,
    getQuantity,
    addToCart,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    applyCoupon: store.applyCoupon,
    removeCoupon: store.removeCoupon,
  }
}

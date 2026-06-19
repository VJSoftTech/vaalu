import { useWishlistStore } from '@/store/wishlistStore'
import type { Book } from '@/types'

export const useWishlist = () => {
  const store = useWishlistStore()

  return {
    items: store.items,
    itemCount: store.getItemCount(),
    isInWishlist: store.isInWishlist,
    toggleWishlist: (book: Book) => store.toggleItem(book),
    removeFromWishlist: store.removeItem,
    clearWishlist: store.clearAll,
  }
}

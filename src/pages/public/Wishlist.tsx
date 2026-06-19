import { Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/formatters'
import { getBookCover } from '@/assets/images/bookCovers'
import { ShoppingCart } from 'lucide-react'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart, isInCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container py-24 flex flex-col items-center gap-4 text-center">
        <Heart className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
        <p className="text-muted-foreground">Save books you love to buy them later</p>
        <Link to="/books"><Button>Browse Books</Button></Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-muted-foreground text-sm">{items.length} {items.length === 1 ? 'book' : 'books'}</span>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((book) => (
          <div key={book.id} className="group rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Link to={`/books/${book.id}`} className="relative block aspect-[3/4] overflow-hidden">
              <img
                src={getBookCover(book.id, book.cover_image)}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="p-3">
              <Link to={`/books/${book.id}`}>
                <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{book.title}</h3>
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">{book.author_name}</p>
              <div className="mt-2">
                {book.discount_price ? (
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-primary">{formatCurrency(book.discount_price)}</span>
                    <span className="text-xs text-muted-foreground line-through">{formatCurrency(book.price)}</span>
                  </div>
                ) : (
                  <span className="font-semibold text-primary">{formatCurrency(book.price)}</span>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant={isInCart(book.id) ? 'secondary' : 'default'}
                  onClick={() => addToCart(book)}
                  className="flex-1 h-8 text-xs"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {isInCart(book.id) ? 'In Cart' : 'Add to Cart'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFromWishlist(book.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

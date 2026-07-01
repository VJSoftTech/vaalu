import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Book } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { calculateDiscount } from '@/utils/helpers'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBookCover } from '@/assets/images/bookCovers'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  book: Book
}

export default function BookCard({ book }: Props) {
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { t } = useLanguage()
  const b = t.books
  const discount = calculateDiscount(book.price, book.discount_price)
  const wishlisted = isInWishlist(book.id)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link to={`/books/${book.id}`} className="relative block aspect-[3/4] overflow-hidden">
        <img
          src={getBookCover(book.id, book.cover_image)}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-xs">{discount}% {b.off}</Badge>
        )}
      </Link>

      {/* Wishlist button outside the link to prevent navigation */}
      <div className="relative">
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(book) }}
          className={cn(
            'absolute -top-8 right-2 p-1.5 rounded-full bg-white shadow transition-all',
            wishlisted
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100',
          )}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn('h-4 w-4 transition-colors', wishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground')}
          />
        </button>
      </div>

      <div className="p-3">
        <Link to={`/books/${book.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">{book.author_name}</p>

        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs">{book.rating != null ? Number(book.rating).toFixed(1) : '—'}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            {book.discount_price ? (
              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-primary">
                  {formatCurrency(book.discount_price)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrency(book.price)}
                </span>
              </div>
            ) : (
              <span className="font-semibold text-primary">{formatCurrency(book.price)}</span>
            )}
          </div>
          <Button
            size="sm"
            variant={isInCart(book.id) ? 'secondary' : 'default'}
            onClick={() => addToCart(book)}
            className="h-7 text-xs px-2"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            {isInCart(book.id) ? b.added : b.add}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

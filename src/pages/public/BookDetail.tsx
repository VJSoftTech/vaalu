import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, FileText } from 'lucide-react'
import { bookService } from '@/services/bookService'
import type { Book } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { calculateDiscount } from '@/utils/helpers'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBookCover } from '@/assets/images/bookCovers'

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    if (!id) return
    bookService
      .getById(Number(id))
      .then(setBook)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner className="py-24" />
  if (!book) return <div className="container py-24 text-center">Book not found.</div>

  const discount = calculateDiscount(book.price, book.discount_price)

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative max-w-xs mx-auto md:mx-0">
          <img
            src={getBookCover(book.id, book.cover_image)}
            alt={book.title}
            className="w-full rounded-lg shadow-lg"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-destructive text-lg">{discount}% OFF</Badge>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <Link
              to={`/authors/${book.author_id}`}
              className="text-primary hover:underline mt-1 inline-block"
            >
              {book.author_name}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${s <= Math.round(Number(book.rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
              />
            ))}
            <span className="text-sm text-muted-foreground">({book.rating != null ? Number(book.rating).toFixed(1) : '—'})</span>
          </div>

          <div className="flex items-baseline gap-3">
            {book.discount_price ? (
              <>
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(book.discount_price)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatCurrency(book.price)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">{formatCurrency(book.price)}</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm">
            <span
              className={book.stock_quantity > 0 ? 'text-green-600' : 'text-destructive'}
            >
              {book.stock_quantity > 0
                ? `In Stock (${book.stock_quantity} available)`
                : 'Out of Stock'}
            </span>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              size="lg"
              onClick={() => addToCart(book)}
              disabled={book.stock_quantity === 0}
              variant={isInCart(book.id) ? 'secondary' : 'default'}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isInCart(book.id) ? 'Added to Cart' : 'Add to Cart'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toggleWishlist(book)}
              className={isInWishlist(book.id) ? 'text-red-500 border-red-300' : ''}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(book.id) ? 'fill-red-500' : ''}`} />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
            {book.preview_pdf && (
              <Button size="lg" variant="outline" asChild>
                <a href={book.preview_pdf} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-5 w-5 mr-2" />
                  Preview PDF
                </a>
              </Button>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">About this book</h3>
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm border rounded-lg p-3">
            <div><span className="text-muted-foreground">ISBN:</span> {book.isbn}</div>
            <div><span className="text-muted-foreground">Category:</span> {book.category_name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

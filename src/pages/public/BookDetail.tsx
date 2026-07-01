import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Star, ShoppingCart, Heart, Share2, FileText, ExternalLink } from 'lucide-react'
import { bookService } from '@/services/bookService'
import { reviewService } from '@/services/reviewService'
import { reviewSchema } from '@/utils/validators'
import type { Book, Review, ReviewFormData } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { calculateDiscount } from '@/utils/helpers'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { toast } from '@/hooks/useToast'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { getBookCover } from '@/assets/images/bookCovers'
import ImageLightbox from '@/components/common/ImageLightbox'

function ReviewsSection({ book }: { book: Book }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0 } })

  useEffect(() => {
    reviewService
      .getByBook(book.id)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [book.id])

  const onSubmit = async (data: ReviewFormData) => {
    try {
      const review = await reviewService.create(book.id, data)
      setReviews((prev) => [review, ...prev])
      reset({ customer_name: '', customer_email: '', comment: '', rating: 0 })
      toast({ title: 'Thank you for your feedback!' })
    } catch {
      toast({ title: 'Failed to submit review', variant: 'destructive' })
    }
  }

  return (
    <div className="mt-12 grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h3>
        {loading ? (
          <LoadingSpinner className="py-8" />
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reviews yet. Be the first to share your feedback.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.customer_name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="customer_name">Name</Label>
            <Input id="customer_name" {...register('customer_name')} />
            {errors.customer_name && <p className="text-xs text-destructive">{errors.customer_name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="customer_email">Email (optional)</Label>
            <Input id="customer_email" type="email" {...register('customer_email')} />
            {errors.customer_email && <p className="text-xs text-destructive">{errors.customer_email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Rating</Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => field.onChange(s)}>
                      <Star
                        className={`h-6 w-6 ${s <= field.value ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="comment">Comment</Label>
            <Textarea id="comment" rows={4} {...register('comment')} />
            {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    bookService
      .getById(Number(id))
      .then(setBook)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner className="py-24" />
  if (!book) return <div className="container py-24 text-center">Book not found.</div>

  const discount = calculateDiscount(book.price, book.discount_price)
  const thamizhBooksUrl = book.external_url || 'https://thamizhbooks.com/product/mayil-pota-kanakku/'
  const coverSrc = getBookCover(book.id, book.cover_image)

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative max-w-xs mx-auto md:mx-0">
          <img
            src={coverSrc}
            alt={book.title}
            onClick={() => setLightboxOpen(true)}
            className="w-full rounded-lg shadow-lg cursor-zoom-in"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-destructive text-lg">{discount}% OFF</Badge>
          )}
          <ImageLightbox src={coverSrc} alt={book.title} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
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

          <a
            href={thamizhBooksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1 text-sm break-all"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            {thamizhBooksUrl}
          </a>

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

      <ReviewsSection book={book} />
    </div>
  )
}

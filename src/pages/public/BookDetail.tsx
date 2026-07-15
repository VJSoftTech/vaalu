import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Star, ShoppingCart, Heart, Share2, FileText, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { bookService } from '@/services/bookService'
import { reviewService } from '@/services/reviewService'
import { reviewSchema } from '@/utils/validators'
import type { Book, Review, ReviewFormData } from '@/types'
import { formatCurrency, formatDate, formatIsbn } from '@/utils/formatters'
import { calculateDiscount } from '@/utils/helpers'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useLanguage } from '@/contexts/LanguageContext'
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
import BookCarousel from '@/components/books/BookCarousel'

function ReviewsSection({ book }: { book: Book }) {
  const { t } = useLanguage()
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
      toast({ title: t.bookDetail.thankYouFeedback })
    } catch {
      toast({ title: t.bookDetail.failedSubmitReview, variant: 'destructive' })
    }
  }

  return (
    <div className="mt-12 grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">{t.bookDetail.reviews} ({reviews.length})</h3>
        {loading ? (
          <LoadingSpinner className="py-8" />
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t.bookDetail.noReviews}</p>
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
        <h3 className="text-xl font-semibold mb-4">{t.bookDetail.writeAReview}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="customer_name">{t.bookDetail.name} <span className="text-red-500">*</span></Label>
            <Input id="customer_name" {...register('customer_name')} />
            {errors.customer_name && <p className="text-xs text-destructive">{errors.customer_name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="customer_email">{t.bookDetail.emailOptional}</Label>
            <Input id="customer_email" type="email" {...register('customer_email')} />
            {errors.customer_email && <p className="text-xs text-destructive">{errors.customer_email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>{t.bookDetail.rating} <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="comment">{t.bookDetail.comment} <span className="text-red-500">*</span></Label>
            <Textarea id="comment" rows={4} {...register('comment')} />
            {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.bookDetail.submitting : t.bookDetail.submitReview}
          </Button>
        </form>
      </div>
    </div>
  )
}

function BookNav({ prevBook, nextBook }: { prevBook: Book | null; nextBook: Book | null }) {
  const { t } = useLanguage()
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      {prevBook ? (
        <Link
          to={`/books/${prevBook.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="truncate max-w-[10rem] sm:max-w-xs">{t.bookDetail.previousBook}</span>
        </Link>
      ) : <span />}
      {nextBook ? (
        <Link
          to={`/books/${nextBook.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="truncate max-w-[10rem] sm:max-w-xs">{t.bookDetail.nextBook}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : <span />}
    </div>
  )
}

export default function BookDetail() {
  const { t } = useLanguage()
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [allBooks, setAllBooks] = useState<Book[]>([])
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

  useEffect(() => {
    bookService
      .getAll({ sort_by: 'created_at', sort_order: 'asc' })
      .then((res) => setAllBooks(res.data))
      .catch(() => {})
  }, [])

  if (loading) return <LoadingSpinner className="py-24" />
  if (!book) return <div className="container py-24 text-center">{t.bookDetail.bookNotFound}</div>

  const discount = calculateDiscount(book.price, book.discount_price)
  const thamizhBooksUrl = book.external_url || 'https://thamizhbooks.com/product/mayil-pota-kanakku/'
  const coverSrc = getBookCover(book.id, book.cover_image)

  const currentIndex = allBooks.findIndex((b) => b.id === book.id)
  const prevBook = currentIndex > 0 ? allBooks[currentIndex - 1] : null
  const nextBook = currentIndex >= 0 && currentIndex < allBooks.length - 1 ? allBooks[currentIndex + 1] : null

  const sameCategory = allBooks.filter((b) => b.id !== book.id && b.category_id === book.category_id)
  const carouselBooks = (sameCategory.length >= 4 ? sameCategory : allBooks.filter((b) => b.id !== book.id)).slice(0, 12)

  return (
    <div className="container py-8">
      <BookNav prevBook={prevBook} nextBook={nextBook} />

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
            {book.subtitle && <p className="text-lg text-muted-foreground mt-1">{book.subtitle}</p>}
            <div className="mt-1 flex flex-wrap items-center gap-x-1 text-sm">
              {(book.authors && book.authors.length > 0 ? book.authors : book.author_name ? [{ id: book.author_id, name: book.author_name }] : []).map((a, idx, arr) => (
                <span key={a.id}>
                  <Link to={`/authors/${a.id}`} className="text-primary hover:underline">
                    {a.name}
                  </Link>
                  {idx < arr.length - 1 && <span className="text-muted-foreground">, </span>}
                </span>
              ))}
            </div>
            {book.editors && book.editors.length > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                {t.bookDetail.editor}: {book.editors.map((e) => e.name).join(', ')}
              </p>
            )}
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
                ? `${t.bookDetail.inStock} (${book.stock_quantity} ${t.bookDetail.available})`
                : t.bookDetail.outOfStock}
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
              {isInCart(book.id) ? t.bookDetail.addedToCart : t.bookDetail.addToCart}
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
                  {t.bookDetail.previewPdf}
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
            <h3 className="font-semibold mb-2">{t.bookDetail.aboutThisBook}</h3>
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm border rounded-lg p-3">
            <div><span className="text-muted-foreground">{t.bookDetail.isbn}:</span> {formatIsbn(book.isbn)}</div>
            <div><span className="text-muted-foreground">{t.bookDetail.category}:</span> {book.category_name}</div>
            {book.publisher && (
              <div><span className="text-muted-foreground">{t.bookDetail.publisher}:</span> {book.publisher}</div>
            )}
            {book.total_pages != null && (
              <div><span className="text-muted-foreground">{t.bookDetail.pages}:</span> {book.total_pages}</div>
            )}
            {book.print_type && (
              <div><span className="text-muted-foreground">{t.bookDetail.printType}:</span> {book.print_type}</div>
            )}
            {book.publication_year != null && (
              <div><span className="text-muted-foreground">{t.bookDetail.publicationYear}:</span> {book.publication_year}</div>
            )}
            {book.edition && (
              <div><span className="text-muted-foreground">{t.bookDetail.edition}:</span> {book.edition}</div>
            )}
            {book.publisher_serial_number && (
              <div><span className="text-muted-foreground">{t.bookDetail.publisherSerialNumber}:</span> {book.publisher_serial_number}</div>
            )}
          </div>
        </div>
      </div>

      {carouselBooks.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">{t.bookDetail.relatedBooks}</h3>
          <BookCarousel books={carouselBooks} />
        </div>
      )}

      <ReviewsSection book={book} />

      <BookNav prevBook={prevBook} nextBook={nextBook} />
    </div>
  )
}

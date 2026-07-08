import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { reviewService } from '@/services/reviewService'
import type { Review } from '@/types'
import { formatDate } from '@/utils/formatters'
import { useLanguage } from '@/contexts/LanguageContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function StarRow({ rating, size = 'h-4 w-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn(size, s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted')} />
      ))}
    </div>
  )
}

const CARD_COLORS = [
  { avatar: 'bg-red-100 text-red-700', border: 'border-l-red-400' },
  { avatar: 'bg-amber-100 text-amber-700', border: 'border-l-amber-400' },
  { avatar: 'bg-emerald-100 text-emerald-700', border: 'border-l-emerald-400' },
  { avatar: 'bg-sky-100 text-sky-700', border: 'border-l-sky-400' },
  { avatar: 'bg-violet-100 text-violet-700', border: 'border-l-violet-400' },
  { avatar: 'bg-pink-100 text-pink-700', border: 'border-l-pink-400' },
]

function cardColor(name: string) {
  const idx = name.charCodeAt(0) % CARD_COLORS.length
  return CARD_COLORS[idx] || CARD_COLORS[0]
}

export default function Reviews() {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewService.getAll().then(setReviews).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const total = reviews.length
  const average = total ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">{t.reviews.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.reviews.subtitle}</p>
        </div>
        {!loading && total > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    'h-3.5 w-3.5',
                    s <= Math.round(average) ? 'fill-yellow-300 text-yellow-300 animate-pulse' : 'text-white/30',
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-white">{average.toFixed(1)}</span>
            <span className="text-xs text-white/80">
              ({total} {t.reviews.totalReviews})
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : total === 0 ? (
        <p className="text-muted-foreground text-sm py-16 text-center">{t.reviews.noReviews}</p>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(210px,220px))]">
          {reviews.map((r) => {
            const colors = cardColor(r.customer_name)
            return (
            <Card key={r.id} className={cn('group relative overflow-hidden border-l-4 transition-all hover:shadow-md hover:-translate-y-0.5', colors.border)}>
              <CardContent className="p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={cn('h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold uppercase shrink-0', colors.avatar)}>
                    {r.customer_name?.trim()?.[0] || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">{r.customer_name}</div>
                    <div className="text-[10px] text-muted-foreground">{formatDate(r.created_at)}</div>
                  </div>
                </div>

                <StarRow rating={r.rating} size="h-3 w-3" />

                <p className="text-xs text-muted-foreground line-clamp-2">{r.comment}</p>

                {r.book_title && (
                  <Link
                    to={`/books/${r.book_id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    {r.book_title}
                  </Link>
                )}
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { giftService } from '@/services/giftService'
import type { GiftItem, GiftFilters } from '@/types'
import { GIFT_CATEGORIES } from '@/types'
import GiftCard from '@/components/gifts/GiftCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/useDebounce'
import { useLanguage } from '@/contexts/LanguageContext'

const LIMIT = 12

export default function Gifts() {
  const { t } = useLanguage()
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<GiftFilters>({ page: 1, limit: LIMIT })
  const [search] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const fetchGifts = useCallback(() => {
    setLoading(true)
    giftService.getAll({ ...filters, search: debouncedSearch })
      .then((r) => { setGifts(r.data); setTotal(r.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filters, debouncedSearch])

  useEffect(() => { fetchGifts() }, [fetchGifts])

  const setCategory = (cat: string) =>
    setFilters((f) => ({ ...f, category: f.category === cat ? '' : cat, page: 1 }))

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.div
  initial={{ opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  className="relative overflow-hidden rounded-3xl shadow-xl"
>
  <img
    src="/gifts/gift-hero-banner.png"
    alt="Vaalu Gift Shop"
    className="w-full h-[120px] sm:h-[150px] md:h-[180px] lg:h-[220px] object-cover"
  />
</motion.div>

      <div className="container space-y-8">

      {/* Search + Filters */}
      <div className="space-y-4">
        {/* <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setFilters((f) => ({ ...f, page: 1 })) }}
            placeholder="Search gifts…"
            className="pl-9"
          />
        </div> */}

        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-1 text-sm text-muted-foreground mr-1">
            <Filter className="h-3.5 w-3.5" /> {t.gifts.category}
          </div>
          <Badge
            variant={!filters.category ? 'default' : 'outline'}
            className="cursor-pointer text-sm px-4 py-1.5"
            onClick={() => setFilters((f) => ({ ...f, category: '', page: 1 }))}
          >
            {t.gifts.all}
          </Badge>
          {GIFT_CATEGORIES.map((c) => (
            <Badge
              key={c}
              variant={filters.category === c ? 'default' : 'outline'}
              className="cursor-pointer text-sm px-4 py-1.5"
              onClick={() => setCategory(c)}
            >
              {c}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-muted animate-pulse aspect-[4/5]" />
          ))}
        </div>
      ) : gifts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <span className="text-5xl">🎁</span>
          <p className="text-lg font-medium">{t.gifts.noGiftsFound}</p>
          <p className="text-sm">{t.gifts.tryDifferentCategory}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{total} {total !== 1 ? t.gifts.giftsFound : t.gifts.giftFound}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
          >
            {t.gifts.previous}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t.gifts.page} {filters.page} {t.gifts.of} {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
          >
            {t.gifts.next}
          </Button>
        </div>
      )}
      </div>
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Headphones,
  Play, Phone, Mail, MapPin, MessageCircle,
} from 'lucide-react'
import WhatsAppIcon from '@/components/common/WhatsAppIcon'
import { bookService } from '@/services/bookService'
import { videoService } from '@/services/videoService'
import { giftService } from '@/services/giftService'
import { bannerService } from '@/services/bannerService'
import type { Book, Advertisement, Video, GiftItem } from '@/types'
import BookCard from '@/components/books/BookCard'
import GiftCard from '@/components/gifts/GiftCard'
import BookPageLoader from '@/components/common/BookPageLoader'
import { Button } from '@/components/ui/button'
import HeroBannerSlider from '@/components/home/HeroBannerSlider'
import DefaultHero from '@/components/home/DefaultHero'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [banners, setBanners] = useState<Advertisement[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [featuredGifts, setFeaturedGifts] = useState<GiftItem[]>([])
  const [loading, setLoading] = useState(true)
  const booksScrollRef = useRef<HTMLDivElement>(null)
  const videosScrollRef = useRef<HTMLDivElement>(null)
  const offerEnd = new Date(Date.now() + 2 * 86400000 + 14 * 3600000 + 36 * 60000 + 48000)
  const countdown = useCountdown(offerEnd)
  const { t, lang } = useLanguage()
  const h = t.home
  const ta = lang === 'ta'

  useEffect(() => {
    Promise.allSettled([
      bookService.getAll({ limit: 12, sort_by: 'created_at', sort_order: 'desc' }),
      bannerService.getActiveBanners(),
      videoService.getAll({ limit: 6 }),
      giftService.getFeatured(8),
    ])
      .then(([booksRes, bannersRes, videosRes, giftsRes]) => {
        if (booksRes.status === 'fulfilled') setBooks(booksRes.value.data ?? [])
        if (bannersRes.status === 'fulfilled') setBanners(bannersRes.value.data ?? [])
        if (videosRes.status === 'fulfilled') setVideos(videosRes.value.data ?? [])
        if (giftsRes.status === 'fulfilled') setFeaturedGifts(giftsRes.value.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  const trustBadges = [
    { icon: Truck, title: h.freeShipping, desc: h.freeShippingDesc },
    { icon: Shield, title: h.securePayment, desc: h.securePaymentDesc },
    { icon: RefreshCw, title: h.easyReturns, desc: h.easyReturnsDesc },
    { icon: Headphones, title: h.support, desc: h.supportDesc },
  ]

  return (
    <div className="space-y-0">
      {/* ── Hero Banner Slider ── */}
      {loading ? (
        <DefaultHero />
      ) : (
        <HeroBannerSlider banners={banners} autoPlayInterval={5000} />
      )}

      {/* ── Trust Badges ── */}
      <section className="border-y bg-white">
        <div className="container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className={cn('font-semibold text-sm', ta && 'font-tamil')}>{title}</div>
                  <div className={cn('text-xs text-muted-foreground', ta && 'font-tamil')}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Books ── */}
      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={cn('text-2xl font-bold', ta && 'font-tamil')}>{h.latestBooks}</h2>
            <div className="h-1 w-12 bg-primary rounded-full mt-1" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll(booksScrollRef, 'left')}
              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(booksScrollRef, 'right')}
              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link to="/books" className={cn('flex items-center gap-1 text-sm text-primary hover:underline ml-2', ta && 'font-tamil')}>
              {h.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {loading ? (
          <BookPageLoader className="py-12" />
        ) : (
          <div
            ref={booksScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          >
            {books.map((book) => (
              <div key={book.id} className="w-56 shrink-0">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Animated Gift Currency CTA ── */}
      <section className="container pb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-800 to-emerald-900 text-white p-6 md:p-8 shadow-xl">
          {/* Glowing background blobs */}
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-400/20 blur-3xl pointer-events-none" />

          {/* Flying currency notes */}
          {[
            { note: '₹500', left: '4%', delay: 0, dir: 1 },
            { note: '₹100', left: '18%', delay: 0.7, dir: -1 },
            { note: '₹200', left: '34%', delay: 1.3, dir: 1 },
            { note: '₹2000', left: '52%', delay: 0.4, dir: -1 },
            { note: '₹50', left: '68%', delay: 1.0, dir: 1 },
            { note: '₹500', left: '82%', delay: 0.2, dir: -1 },
          ].map(({ note, left, delay, dir }, i) => (
            <motion.div
              key={i}
              className="absolute bottom-2 select-none pointer-events-none z-0"
              style={{ left }}
              animate={{ y: [0, -110], x: [0, dir * 18], opacity: [0, 1, 0], rotate: [0, dir * 14] }}
              transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeOut' }}
            >
              <span className="text-[11px] font-bold bg-yellow-100/20 border border-yellow-300/40 text-yellow-200 px-1.5 py-0.5 rounded">
                {note}
              </span>
            </motion.div>
          ))}

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Animated gift box */}
            <div className="relative shrink-0 w-28 h-28 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-orange-400/30 blur-xl"
              />
              <motion.div
                animate={{ rotate: [-6, 6, -6], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-7xl relative z-10 drop-shadow-lg"
              >
                🎁
              </motion.div>
              {[
                { emoji: '✨', top: '-8%', left: '-18%', delay: 0 },
                { emoji: '⭐', top: '8%', left: '112%', delay: 0.5 },
                { emoji: '💫', top: '88%', left: '-18%', delay: 1.1 },
                { emoji: '✨', top: '72%', left: '108%', delay: 0.8 },
              ].map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute text-base pointer-events-none"
                  style={{ top: s.top, left: s.left }}
                  animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: s.delay }}
                >
                  {s.emoji}
                </motion.span>
              ))}
            </div>

            {/* Text content */}
            <div className="flex-1 text-center md:text-left">
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('text-yellow-300 font-semibold text-sm mb-1', ta && 'font-tamil')}
              >
                {h.giftBadge}
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cn('text-2xl md:text-3xl font-bold mb-2 leading-tight', ta && 'font-tamil')}
              >
                {h.giftTitle}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn('text-white/80 text-sm leading-relaxed', ta && 'font-tamil')}
              >
                {h.giftDesc}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mt-3"
              >
                {[h.tagBirthdays, h.tagWeddings, h.tagFestivals, h.tagCorporate].map(tag => (
                  <span key={tag} className={cn('text-xs bg-white/15 rounded-full px-2.5 py-1', ta && 'font-tamil')}>{tag}</span>
                ))}
              </motion.div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <Link to="/gifts">
                <Button className={cn('bg-orange-400 hover:bg-orange-300 text-orange-950 font-semibold gap-2 w-full shadow-lg', ta && 'font-tamil')}>
                  {h.exploreGifts} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://wa.me/919444296929?text=Hi%2C%20I%20am%20interested%20in%20Custom%20Gift%20Currency%20Notes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className={cn('bg-green-500 hover:bg-green-400 text-white gap-2 w-full font-semibold shadow-lg', ta && 'font-tamil')}>
                  <WhatsAppIcon /> {h.whatsappEnquiry}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Festival Offer Banner ── */}
      {banners.length > 0 || true ? (
        <section className="container pb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-red-700 text-white p-6 md:p-8">
            <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-red-900/40 to-transparent" />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl hidden md:block">🎁</div>
              <div className="flex-1 text-center md:text-left">
                <div className={cn('text-yellow-300 font-semibold text-sm mb-1', ta && 'font-tamil')}>{h.festivalBadge}</div>
                <h3 className={cn('text-2xl font-bold mb-1', ta && 'font-tamil')}>{h.festivalTitle}</h3>
                <p className={cn('text-white/80 text-sm', ta && 'font-tamil')}>{h.festivalDesc}</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className={cn('text-sm text-white/80', ta && 'font-tamil')}>{h.offerEndsIn}</div>
                <div className="flex gap-2">
                  {[
                    { val: countdown.days, label: h.days },
                    { val: countdown.hours, label: h.hours },
                    { val: countdown.mins, label: h.mins },
                    { val: countdown.secs, label: h.secs },
                  ].map(({ val, label }) => (
                    <div key={label} className="flex flex-col items-center bg-white/20 backdrop-blur rounded-lg px-3 py-2 min-w-[52px]">
                      <span className="text-2xl font-bold tabular-nums">
                        {String(val).padStart(2, '0')}
                      </span>
                      <span className={cn('text-[10px] text-white/70', ta && 'font-tamil')}>{label}</span>
                    </div>
                  ))}
                </div>
                <Link to="/offers">
                  <Button size="sm" className={cn('bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-semibold gap-1', ta && 'font-tamil')}>
                    {h.exploreOffers} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Vaalu TV ── */}
      {videos.length > 0 && (
        <section className="container pb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={cn('text-2xl font-bold', ta && 'font-tamil')}>{h.vaaluTv}</h2>
              <div className="h-1 w-12 bg-primary rounded-full mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll(videosScrollRef, 'left')}
                className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll(videosScrollRef, 'right')}
                className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <Link to="/vaalu-tv" className={cn('flex items-center gap-1 text-sm text-primary hover:underline ml-2', ta && 'font-tamil')}>
                {h.viewAll} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div
            ref={videosScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          >
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-64 shrink-0 group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  <img
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-5 w-5 fill-primary text-primary ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── Gift Currency & Calendar Gifts ── */}
      {(featuredGifts.length > 0 || !loading) && (
        <section className="container pb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={cn('text-2xl font-bold font-tamil', ta && 'font-tamil')}>{h.giftSectionTitle}</h2>
              <p className={cn('text-muted-foreground text-sm mt-1', ta && 'font-tamil')}>
                {h.giftSectionDesc}
              </p>
              <div className="h-1 w-12 bg-teal-600 rounded-full mt-2" />
            </div>
            <Link to="/gifts" className={cn('flex items-center gap-1 text-sm text-teal-700 hover:underline', ta && 'font-tamil')}>
              {h.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-muted animate-pulse aspect-[4/5]" />
              ))}
            </div>
          ) : featuredGifts.length === 0 ? null : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredGifts.map((gift) => (
                <GiftCard key={gift.id} gift={gift} />
              ))}
            </div>
          )}

        </section>
      )}

      {/* ── Contact Us CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-red-700 to-red-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02eiIvPjwvZz48L2c+PC9zdmc+')]" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />

        <div className="container relative py-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2', ta && 'font-tamil')}
              >
                <MessageCircle className="h-4 w-4" /> {h.contactBadge}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={cn('text-3xl md:text-4xl font-bold mb-3 leading-tight', ta && 'font-tamil')}
              >
                {h.contactTitle}<br />
                <span className="text-yellow-300 font-tamil">வாலு பதிப்பகம்</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cn('text-white/80 text-sm leading-relaxed mb-6 max-w-md', ta && 'font-tamil')}
              >
                {h.contactDesc}
              </motion.p>

              {/* Quick contact info */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-3 mb-8"
              >
                {[
                  { Icon: Phone, text: '+91 94442 96929' },
                  { Icon: Mail, text: 'vaalupathippagam@gmail.com' },
                  { Icon: MapPin, text: h.address },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-white/90">
                    <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    {text}
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-3"
              >
                <Link to="/contact">
                  <Button className={cn('bg-white text-primary hover:bg-white/90 font-semibold gap-2 shadow-lg', ta && 'font-tamil')}>
                    <MessageCircle className="h-4 w-4" /> {h.contactUs}
                  </Button>
                </Link>
                <a
                  href="https://wa.me/919444296929?text=Hi%2C%20I%20have%20an%20enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className={cn('bg-green-500 hover:bg-green-400 text-white gap-2 font-semibold shadow-lg', ta && 'font-tamil')}>
                    <WhatsAppIcon /> {h.whatsappUs}
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Right: Cards */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Phone, label: h.callUs, value: '+91 94442 96929', color: 'bg-blue-500/20 border-blue-300/30' },
                { icon: Mail, label: h.emailUs, value: 'vaalupathippagam@gmail.com', color: 'bg-white/10 border-white/20' },
                { icon: MapPin, label: h.visitUs, value: h.address.replace(', ', ',\n'), color: 'bg-emerald-500/20 border-emerald-300/30' },
                { icon: WhatsAppIcon, label: 'WhatsApp', value: '+91 94442 96929', color: 'bg-green-500/20 border-green-300/30' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className={`rounded-2xl border ${color} p-4 backdrop-blur-sm`}>
                  <Icon className="h-5 w-5 text-white/80 mb-2" />
                  <div className={cn('text-xs text-white/60 mb-1', ta && 'font-tamil')}>{label}</div>
                  <div className="text-sm font-semibold text-white leading-snug whitespace-pre-line">{value}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Headphones,
  BookOpen, Users, Heart, Clock, Play, Phone, Mail, MapPin, MessageCircle,
} from 'lucide-react'
import WhatsAppIcon from '@/components/common/WhatsAppIcon'
import { bookService } from '@/services/bookService'
import { advertisementService } from '@/services/advertisementService'
import { videoService } from '@/services/videoService'
import { giftService } from '@/services/giftService'
import type { Book, Advertisement, Video, GiftItem } from '@/types'
import BookCard from '@/components/books/BookCard'
import GiftCard from '@/components/gifts/GiftCard'
import BookPageLoader from '@/components/common/BookPageLoader'
import { Button } from '@/components/ui/button'

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

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹499' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure payments' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7 days return policy' },
  { icon: Headphones, title: '24/7 Support', desc: "We're here to help" },
]

const STATS = [
  { icon: BookOpen, value: '5000+', label: 'Books' },
  { icon: Users, value: '200+', label: 'Authors' },
  { icon: Heart, value: '50K+', label: 'Happy Readers' },
  { icon: Clock, value: '10+', label: 'Years of Legacy' },
]

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [ads, setAds] = useState<Advertisement[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [featuredGifts, setFeaturedGifts] = useState<GiftItem[]>([])
  const [loading, setLoading] = useState(true)
  const booksScrollRef = useRef<HTMLDivElement>(null)
  const videosScrollRef = useRef<HTMLDivElement>(null)
  const offerEnd = new Date(Date.now() + 2 * 86400000 + 14 * 3600000 + 36 * 60000 + 48000)
  const countdown = useCountdown(offerEnd)

  useEffect(() => {
    Promise.allSettled([
      bookService.getAll({ limit: 12, sort_by: 'created_at', sort_order: 'desc' }),
      advertisementService.getAll({ is_active: true }),
      videoService.getAll({ limit: 6 }),
      giftService.getFeatured(8),
    ])
      .then(([booksRes, adsRes, videosRes, giftsRes]) => {
        if (booksRes.status === 'fulfilled') setBooks(booksRes.value.data ?? [])
        if (adsRes.status === 'fulfilled') setAds(adsRes.value.data ?? [])
        if (videosRes.status === 'fulfilled') setVideos(videosRes.value.data ?? [])
        if (giftsRes.status === 'fulfilled') setFeaturedGifts(giftsRes.value.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <div className="space-y-0">
      {/* ── Hero ── */}
      {/* <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 py-16 md:py-24"> */}
        <section
  className="relative overflow-hidden py-16 md:py-24 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/hero-banner.png')",
  }}
>
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02eiIvPjwvZz48L2c+PC9zdmc+')]" />
        <div className="container relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Content */}
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-primary font-medium text-sm mb-3 flex items-center gap-2"
              >
                <Heart className="h-4 w-4 fill-primary" /> Preserving Tamil Literature
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold text-primary font-tamil mb-4"
              >
                <span className="block">வாலு</span>
                <span className="block mt-2">பதிப்பகம்</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-foreground/70 text-lg mb-8"
              >
                Discover the richness of Tamil literature.<br />
                Books that inspire, enlighten, and connect.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3 flex-wrap"
              >
                <Link to="/books">
                  <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg">
                    Browse Books <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/vaalu-tv">
                  <Button size="lg" variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5">
                    <Play className="h-4 w-4 fill-primary" /> Vaalu TV
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10"
              >
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-white/70 rounded-xl p-3 shadow-sm border border-white">
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <div className="font-bold text-foreground leading-tight">{value}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Hero Banner Image */}
            
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="border-y bg-white">
        <div className="container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
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
            <h2 className="text-2xl font-bold">Latest Books</h2>
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
            <Link to="/books" className="flex items-center gap-1 text-sm text-primary hover:underline ml-2">
              View all <ArrowRight className="h-4 w-4" />
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
              {/* Sparkles */}
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
                className="text-yellow-300 font-semibold text-sm mb-1"
              >
                ✦ Exclusive Custom Gift Currency Notes
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-3xl font-bold mb-2 leading-tight"
              >
                🎁 Custom Gift Currency Notes
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-sm leading-relaxed"
              >
                Personalized gift notes for every occasion — birthdays, weddings, festivals & corporate events.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mt-3"
              >
                {['🎂 Birthdays', '💒 Weddings', '🎊 Festivals', '🏢 Corporate'].map(tag => (
                  <span key={tag} className="text-xs bg-white/15 rounded-full px-2.5 py-1">{tag}</span>
                ))}
              </motion.div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <Link to="/gifts">
                <Button className="bg-orange-400 hover:bg-orange-300 text-orange-950 font-semibold gap-2 w-full shadow-lg">
                  Explore Gifts <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://wa.me/919444296929?text=Hi%2C%20I%20am%20interested%20in%20Custom%20Gift%20Currency%20Notes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="bg-green-500 hover:bg-green-400 text-white gap-2 w-full font-semibold shadow-lg">
                  <WhatsAppIcon /> WhatsApp Enquiry
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Festival Offer Banner ── */}
      {ads.length > 0 || true ? (
        <section className="container pb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-red-700 text-white p-6 md:p-8">
            <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-red-900/40 to-transparent" />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl hidden md:block">🎁</div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-yellow-300 font-semibold text-sm mb-1">✦ Special Festival Offer!</div>
                <h3 className="text-2xl font-bold mb-1">Get exciting discounts and currency gifts</h3>
                <p className="text-white/80 text-sm">on selected books. Limited time only!</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="text-sm text-white/80">Offer ends in</div>
                <div className="flex gap-2">
                  {[
                    { val: countdown.days, label: 'Days' },
                    { val: countdown.hours, label: 'Hours' },
                    { val: countdown.mins, label: 'Mins' },
                    { val: countdown.secs, label: 'Secs' },
                  ].map(({ val, label }) => (
                    <div key={label} className="flex flex-col items-center bg-white/20 backdrop-blur rounded-lg px-3 py-2 min-w-[52px]">
                      <span className="text-2xl font-bold tabular-nums">
                        {String(val).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-white/70">{label}</span>
                    </div>
                  ))}
                </div>
                <Link to="/offers">
                  <Button size="sm" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-semibold gap-1">
                    Explore Offers <ArrowRight className="h-3.5 w-3.5" />
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
              <h2 className="text-2xl font-bold">Vaalu TV</h2>
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
              <Link to="/vaalu-tv" className="flex items-center gap-1 text-sm text-primary hover:underline ml-2">
                View all <ArrowRight className="h-4 w-4" />
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
              <h2 className="text-2xl font-bold">🎁 வாழு கிப்ட் கரன்சி & சிறப்பு காலண்டர் பரிசுகள்</h2>
              <p className="text-muted-foreground text-sm mt-1">
                பிறந்தநாள், திருமண நாள், நினைவு நாள் மற்றும் சிறப்பு விழாக்களுக்கு தனிப்பயன் பரிசுகள்
              </p>
              <div className="h-1 w-12 bg-teal-600 rounded-full mt-2" />
            </div>
            <Link to="/gifts" className="flex items-center gap-1 text-sm text-teal-700 hover:underline">
              View all <ArrowRight className="h-4 w-4" />
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
                className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" /> We're here for you
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
              >
                Get in Touch with<br />
                <span className="text-yellow-300 font-tamil">வாலு பதிப்பகம்</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/80 text-sm leading-relaxed mb-6 max-w-md"
              >
                Have a question about books, orders, or custom gift currency notes? Our team is ready to help you — reach out via call, email, or WhatsApp.
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
                  { Icon: MapPin, text: '123, Book Street, Chennai – 600001' },
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
                  <Button className="bg-white text-primary hover:bg-white/90 font-semibold gap-2 shadow-lg">
                    <MessageCircle className="h-4 w-4" /> Contact Us
                  </Button>
                </Link>
                <a
                  href="https://wa.me/919444296929?text=Hi%2C%20I%20have%20an%20enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-500 hover:bg-green-400 text-white gap-2 font-semibold shadow-lg">
                    <WhatsAppIcon /> WhatsApp Us
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
                { icon: Phone, label: 'Call Us', value: '+91 94442 96929', color: 'bg-blue-500/20 border-blue-300/30' },
                { icon: Mail, label: 'Email Us', value: 'vaalupathippagam@gmail.com', color: 'bg-white/10 border-white/20' },
                { icon: MapPin, label: 'Visit Us', value: 'Chennai,\nTamil Nadu', color: 'bg-emerald-500/20 border-emerald-300/30' },
                { icon: WhatsAppIcon, label: 'WhatsApp', value: '+91 94442 96929', color: 'bg-green-500/20 border-green-300/30' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className={`rounded-2xl border ${color} p-4 backdrop-blur-sm`}>
                  <Icon className="h-5 w-5 text-white/80 mb-2" />
                  <div className="text-xs text-white/60 mb-1">{label}</div>
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

import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight,
  ArrowRight, Play, Heart, BookOpen, Users, Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Advertisement } from '@/types'

interface Props {
  banners: Advertisement[]
  autoPlayInterval?: number
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

const STATS = [
  { icon: BookOpen, value: '5000+', label: 'Books' },
  { icon: Users,    value: '200+',  label: 'Authors' },
  { icon: Heart,    value: '50K+',  label: 'Happy Readers' },
  { icon: Clock,    value: '10+',   label: 'Years of Legacy' },
]

function DefaultSlide() {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-banner.png')" }}
    >
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02eiIvPjwvZz48L2c+PC9zdmc+')]" />
      <div className="container relative h-full flex items-center">
        <div className="grid md:grid-cols-2 gap-10 items-center w-full py-16 md:py-24">
          <div>
            <p className="text-primary font-medium text-sm mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 fill-primary" /> Preserving Tamil Literature
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-primary font-tamil mb-4">
              <span className="block">வாலு</span>
              <span className="block mt-2">பதிப்பகம்</span>
            </h1>
            <p className="text-foreground/70 text-lg mb-8">
              Discover the richness of Tamil literature.<br />
              Books that inspire, enlighten, and connect.
            </p>
            <div className="flex gap-3 flex-wrap">
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
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2 bg-white/70 rounded-xl p-3 shadow-sm border border-white">
                  <Icon className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <div className="font-bold text-foreground leading-tight">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroBannerSlider({ banners, autoPlayInterval = 3000 }: Props) {
  const [current,    setCurrent]   = useState(0)
  const [direction,  setDirection] = useState(1)
  const [hovered,    setHovered]   = useState(false)
  const touchStartX   = useRef<number | null>(null)
  const pointerStartX = useRef<number | null>(null)
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null)

  // Slide 0 = DefaultSlide; slides 1..N = API banners
  const total = 1 + banners.length

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setCurrent((index + total) % total)
  }, [total])

  const next = useCallback(() => goTo(current + 1,  1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo])

  useEffect(() => {
    if (total <= 1) return
    timerRef.current = setInterval(next, autoPlayInterval)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total, next, autoPlayInterval])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev()
    touchStartX.current = null
  }

  const onPointerDown = (e: React.PointerEvent) => { pointerStartX.current = e.clientX }
  const onPointerUp   = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return
    const delta = e.clientX - pointerStartX.current
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev()
    pointerStartX.current = null
  }

  const renderSlide = () => {
    if (current === 0) {
      return (
        <motion.div
          key="default-hero"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
          className="absolute inset-0"
        >
          <DefaultSlide />
        </motion.div>
      )
    }

    const banner = banners[current - 1]
    const isExternal = banner.redirect_url?.startsWith('http')

    return (
      <motion.div
        key={banner.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
        className="absolute inset-0"
      >
        <img
          src={banner.banner_image}
          alt={banner.title}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {(banner.title || banner.subtitle) && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        )}
        {(banner.title || banner.subtitle) && (
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-white text-2xl md:text-4xl lg:text-5xl font-bold max-w-lg leading-tight drop-shadow"
            >
              {banner.title}
            </motion.h2>
            {banner.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-white/90 mt-2 md:mt-3 text-sm md:text-lg max-w-md drop-shadow"
              >
                {banner.subtitle}
              </motion.p>
            )}
            {banner.redirect_url && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4"
              >
                {isExternal ? (
                  <a
                    href={banner.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow hover:bg-primary/90 transition-colors"
                  >
                    Shop Now
                  </a>
                ) : (
                  <Link
                    to={banner.redirect_url}
                    className="inline-block bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow hover:bg-primary/90 transition-colors"
                  >
                    Shop Now
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      aria-label="Hero banner slider"
    >
      {/* Slide container — height matches DefaultHero's natural size */}
      <div className="relative w-full min-h-[520px] md:min-h-[600px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {renderSlide()}
        </AnimatePresence>

        {/* Arrow navigation — visible only on hover */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous slide"
              className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 md:p-2 transition-all duration-300 backdrop-blur-sm ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next slide"
              className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 md:p-2 transition-all duration-300 backdrop-blur-sm ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

    </section>
  )
}

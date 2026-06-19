import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowRight, Play } from 'lucide-react'

const STATS = [
  { emoji: '📖', value: '5000+', label: 'Books' },
  { emoji: '👥', value: '200+', label: 'Authors' },
  { emoji: '❤️', value: '50K+', label: 'Happy Readers' },
  { emoji: '⏰', value: '10+', label: 'Years of Legacy' },
]


export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{
        minHeight: '92vh',
        backgroundImage: `url('/hero-banner.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Left-side gradient overlay so text stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(255,248,242,0.96) 0%, rgba(255,248,242,0.88) 38%, rgba(255,248,242,0.3) 62%, transparent 100%)',
        }}
      />

      <div className="container relative z-10 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ══════════ LEFT SIDE – text over the blank area of the bg image ══════════ */}
          <div className="flex flex-col">

            {/* Heritage badge */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-7"
            >
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-4 py-1.5 select-none"
                style={{
                  background: 'rgba(200,16,46,0.07)',
                  border: '1.5px solid rgba(200,16,46,0.22)',
                  color: '#C8102E',
                  boxShadow: '0 2px 14px rgba(200,16,46,0.12)',
                }}
              >
                <Heart className="h-3.5 w-3.5 fill-[#C8102E]" />
                Preserving Tamil Literature
              </span>
            </motion.div>

            {/* Massive Tamil heading */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="font-bold mb-6 font-tamil leading-none"
              style={{ fontSize: 'clamp(3.8rem, 7vw, 6.5rem)' }}
            >
              <span
                className="block"
                style={{
                  background: 'linear-gradient(145deg, #C8102E 0%, #9b0d24 35%, #C8102E 65%, #e8142f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.08,
                  letterSpacing: '-0.01em',
                }}
              >
                வாலு
              </span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(145deg, #8B0A1A 0%, #C8102E 40%, #a30d26 75%, #C8102E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.08,
                  letterSpacing: '-0.01em',
                }}
              >
                பதிப்பகம்
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="text-lg leading-relaxed mb-8"
              style={{ color: '#7a5c50' }}
            >
              Discover the richness of Tamil literature.<br />
              Books that inspire, enlighten, and connect.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="flex gap-4 flex-wrap mb-10"
            >
              <Link to="/books">
                <button
                  className="group flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl text-white text-[0.9rem] transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, #C8102E 0%, #a30d26 100%)',
                    boxShadow: '0 0 28px rgba(200,16,46,0.42), 0 4px 18px rgba(200,16,46,0.32), 0 1px 6px rgba(0,0,0,0.14)',
                  }}
                >
                  Browse Books
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </Link>
              <Link to="/vaalu-tv">
                <button
                  className="flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl text-[0.9rem] transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] hover:bg-[rgba(200,16,46,0.05)]"
                  style={{
                    background: 'rgba(255,255,255,0.82)',
                    border: '2px solid #C8102E',
                    color: '#C8102E',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
                  }}
                >
                  <Play className="h-4 w-4 fill-[#C8102E]" />
                  Vaalu TV
                </button>
              </Link>
            </motion.div>

            {/* Glassmorphism stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.42 }}
              className="grid grid-cols-2 gap-3"
            >
              {STATS.map(({ emoji, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl p-4 select-none"
                  style={{
                    background: 'rgba(255,255,255,0.68)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.88)',
                    boxShadow: '0 4px 22px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.92)',
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translateY(-3px) scale(1.025)'
                    el.style.boxShadow = '0 10px 32px rgba(0,0,0,0.11), inset 0 1px 0 rgba(255,255,255,0.92)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = ''
                    el.style.boxShadow = '0 4px 22px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.92)'
                  }}
                >
                  <span className="text-2xl flex-shrink-0 leading-none">{emoji}</span>
                  <div>
                    <div className="font-bold text-gray-900 text-xl leading-tight">{value}</div>
                    <div className="text-xs font-medium" style={{ color: '#9a7060' }}>{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

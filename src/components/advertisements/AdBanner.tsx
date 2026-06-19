import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Advertisement } from '@/types'
import { isAdActive } from '@/utils/helpers'

interface Props {
  ads: Advertisement[]
  autoPlay?: boolean
  interval?: number
}

export default function AdBanner({ ads, autoPlay = true, interval = 4000 }: Props) {
  const activeAds = ads.filter((ad) => ad.is_active && isAdActive(ad.start_date, ad.end_date))
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!autoPlay || activeAds.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % activeAds.length), interval)
    return () => clearInterval(timer)
  }, [activeAds.length, autoPlay, interval])

  if (activeAds.length === 0) return null

  return (
    <div className="relative w-full aspect-[4/1] md:aspect-[6/1] overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        {activeAds.map(
          (ad, i) =>
            i === current && (
              <motion.a
                key={ad.id}
                href={ad.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img src={ad.banner_image} alt={ad.title} className="w-full h-full object-cover" />
              </motion.a>
            ),
        )}
      </AnimatePresence>

      {activeAds.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {activeAds.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Sparkles, ExternalLink, BellRing } from 'lucide-react'
import { announcementService } from '@/services/announcementService'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/formatters'
import type { Announcement } from '@/types'

const PRIORITY_STYLES: Record<string, { badge: string; ring: string; label: { en: string; ta: string } }> = {
  urgent: {
    badge: 'bg-red-500 text-white',
    ring: 'ring-2 ring-red-200',
    label: { en: '🔥 Urgent', ta: '🔥 அவசரம்' },
  },
  important: {
    badge: 'bg-amber-500 text-white',
    ring: 'ring-2 ring-amber-200',
    label: { en: '⭐ Important', ta: '⭐ முக்கியம்' },
  },
  normal: {
    badge: 'bg-primary text-primary-foreground',
    ring: '',
    label: { en: 'Update', ta: 'புதுப்பிப்பு' },
  },
}

export default function Announcements() {
  const { lang } = useLanguage()
  const ta = lang === 'ta'
  const { markAllRead } = useAnnouncements()
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    announcementService.getActive()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))
    markAllRead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-gradient-to-b from-primary/5 via-white to-white min-h-[60vh]">
      <div className="container py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <Megaphone className="h-4 w-4" />
            {ta ? 'அறிவிப்புகள்' : 'Announcements'}
          </div>
          <h1 className={cn('text-3xl md:text-4xl font-bold text-foreground', ta && 'font-tamil')}>
            {ta ? 'சமீபத்திய செய்திகள் & அறிவிப்புகள்' : 'Latest News & Announcements'}
          </h1>
          <p className={cn('text-muted-foreground mt-2 max-w-xl mx-auto', ta && 'font-tamil')}>
            {ta
              ? 'வாலு பதிப்பகத்திலிருந்து சிறப்பு சலுகைகள், புதிய வெளியீடுகள் மற்றும் முக்கிய செய்திகளை இங்கே பெறுங்கள்.'
              : 'Stay in the loop with special offers, new releases, and important updates from Vaalu Pathippagam.'}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            {ta ? 'ஏற்றுகிறது…' : 'Loading…'}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 gap-3 text-muted-foreground border rounded-2xl bg-white">
            <BellRing className="h-10 w-10 opacity-30" />
            <p className={cn(ta && 'font-tamil')}>
              {ta ? 'இப்போது அறிவிப்புகள் எதுவும் இல்லை.' : 'No announcements right now. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 max-w-3xl mx-auto">
            {items.map((item, i) => {
              const style = PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.normal
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    'bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden',
                    style.ring,
                  )}
                >
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-full h-44 sm:h-56 object-cover" />
                  )}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('text-[11px] font-bold px-2.5 py-0.5 rounded-full', style.badge)}>
                        {ta ? style.label.ta : style.label.en}
                      </span>
                      {item.priority === 'urgent' && (
                        <Sparkles className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{formatDate(item.created_at)}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1.5">{item.title}</h2>
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{item.message}</p>
                    {item.link_url && (
                      <a
                        href={item.link_url}
                        target={item.link_url.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:underline"
                      >
                        {ta ? 'மேலும் அறிய' : 'Learn more'} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

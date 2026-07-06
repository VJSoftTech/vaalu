import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Heart, BookOpen, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DefaultHero() {
  const { t } = useLanguage()

  const STATS = [
    { icon: BookOpen, value: '5000+', label: t.home.statBooks },
    { icon: Users,    value: '200+',  label: t.home.statAuthors },
    { icon: Heart,    value: '50K+',  label: t.home.statHappyReaders },
    { icon: Clock,    value: '10+',   label: t.home.statYearsLegacy },
  ]

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-banner.png')" }}
    >
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02eiIvPjwvZz48L2c+PC9zdmc+')]" />
      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-primary font-medium text-sm mb-3 flex items-center gap-2"
            >
              <Heart className="h-4 w-4 fill-primary" /> {t.home.heroBadge}
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
              dangerouslySetInnerHTML={{ __html: t.home.heroDesc }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 flex-wrap"
            >
              <Link to="/books">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg">
                  {t.home.browseBooks} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/vaalu-tv">
                <Button size="lg" variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5">
                  <Play className="h-4 w-4 fill-primary" /> {t.home.vaaluTv}
                </Button>
              </Link>
            </motion.div>

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
        </div>
      </div>
    </section>
  )
}

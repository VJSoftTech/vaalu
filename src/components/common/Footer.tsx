import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

type SocialItem = { href: string; label: string; Icon: React.FC<{ className?: string }> }

const socials: SocialItem[] = [
  {
    href: '#',
    label: 'Facebook',
    Icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6a1 1 0 0 1 1-1h3V0h-3a5 5 0 0 0-5 5v3z" />
      </svg>
    ),
  },
  {
    href: 'https://www.youtube.com/@VaaluTV',
    label: 'YouTube',
    Icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'Instagram',
    Icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'X / Twitter',
    Icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const { t, lang } = useLanguage()
  const f = t.footer
  const ta = lang === 'ta'

  const quickLinks = [
    { to: '/about', label: f.links.about },
    { to: '/books', label: f.links.books },
    { to: '/authors', label: f.links.authors },
    { to: '/blog', label: f.links.blog },
    { to: '/vaalu-tv', label: f.links.vaaluTv },
    { to: '/offers', label: f.links.offers },
    { to: '/contact', label: f.links.contact },
    { to: '/wishlist', label: f.links.wishlist },
    { to: '/my-orders', label: f.links.myOrders },
  ]

  const helpLinks = [
    { to: '/shipping', label: f.links.shipping },
    { to: '/returns', label: f.links.returns },
    { to: '/privacy', label: f.links.privacy },
    { to: '/terms', label: f.links.terms },
    { to: '/faq', label: f.links.faq },
    { to: '/orders', label: f.links.trackOrder },
  ]

  return (
    <footer className="bg-vaalu-dark text-white mt-auto">
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-base font-bold leading-tight font-tamil tracking-wide">
                  வாலு பதிப்பகம்
                </div>
                <div className="text-[11px] text-white/40 tracking-widest uppercase leading-tight mt-0.5">
                  Vaalu Pathippagam
                </div>
              </div>
            </Link>

            <p className={cn('text-sm text-white/55 leading-relaxed max-w-xs mb-6', ta && 'font-tamil')}>
              {f.tagline}
            </p>

            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon className="h-3.5 w-3.5 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={cn('text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-5', ta && 'font-tamil')}>
              {f.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn('group inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors duration-200', ta && 'font-tamil')}
                  >
                    <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className={cn('text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-5', ta && 'font-tamil')}>
              {f.helpSupport}
            </h4>
            <ul className="space-y-2.5">
              {helpLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn('group inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors duration-200', ta && 'font-tamil')}
                  >
                    <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={cn('text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-5', ta && 'font-tamil')}>
              {f.contactUs}
            </h4>
            <ul className="space-y-4">
              {[
                { Icon: Phone, text: '+91 94442 96929' },
                { Icon: Mail, text: 'vaalupathippagam@gmail.com' },
                { Icon: MapPin, text: f.address },
                { Icon: Clock, text: f.hours },
              ].map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/15 shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className={cn('text-sm text-white/60 leading-relaxed', ta && 'font-tamil')}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={cn('text-xs text-white/35 tracking-wide', ta && 'font-tamil')}>
            © {new Date().getFullYear()} Vaalu Pathippagam. {f.copyright}
          </p>
          <p className={cn('text-xs text-white/35 tracking-wide', ta && 'font-tamil')}>
            {ta ? (
              <>{f.forLiterature} <span className="text-primary">♥</span> {f.madeWith}</>
            ) : (
              <>{f.madeWith} <span className="text-primary">♥</span> {f.forLiterature}</>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}

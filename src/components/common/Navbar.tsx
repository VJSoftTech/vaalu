import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, BookOpen, Heart, Package, LogOut, User, Globe, ChevronDown, Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Language } from '@/i18n/translations'

export default function Navbar() {
  const { itemCount, clearCart } = useCart()
  const { itemCount: wishlistCount, clearWishlist } = useWishlist()
  const { unreadCount: announcementCount } = useAnnouncements()
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const { lang, setLang, t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const nav = t.nav

  // Only a few short links stay on the bar; everything else collapses into "More" so the
  // bar never runs out of room (Tamil labels run much longer than their English counterparts).
  const primaryLinks: { to: string; label: string; end?: boolean }[] = [
    { to: '/', label: nav.home, end: true },
    { to: '/about', label: nav.about },
    { to: '/publish-plan', label: nav.publishPlan },
    { to: '/books', label: nav.books },
    { to: '/authors', label: nav.authors },
  ]

  const moreLinks: { to: string; label: string; end?: boolean }[] = [
    { to: '/donate-books', label: nav.donateBooks },
    { to: '/gifts', label: nav.gifts },
    { to: '/vaalu-tv', label: nav.vaaluTv },
    { to: '/blog', label: nav.blog },
    { to: '/reviews', label: nav.reviews },
    { to: '/corporate-enquiries', label: nav.corporateEnquiries },
    { to: '/copyright-enquiries', label: nav.copyrightEnquiries },
  ]

  const navLinks = [...primaryLinks, ...moreLinks]

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const handleLogout = () => {
    clearCart()
    clearWishlist()
    clearAuth()
    setUserMenuOpen(false)
    navigate('/')
  }

  const handleLangSelect = (l: Language) => {
    setLang(l)
    setLangMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-primary shrink-0">
          <BookOpen className="h-7 w-7" />
          <div className="hidden sm:block">
            <div className="text-base font-bold leading-tight text-primary font-tamil">வாலு பதிப்பகம்</div>
            <div className="text-[10px] text-muted-foreground leading-tight tracking-wide">Vaalu Pathippagam</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-2 2xl:gap-3 shrink-0">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'shrink-0 text-xs font-medium whitespace-nowrap transition-colors hover:text-primary',
                  isActive ? 'text-primary font-semibold' : 'text-foreground/70',
                  lang === 'ta' && 'font-tamil',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* More dropdown */}
          <div ref={moreMenuRef} className="relative shrink-0">
            <button
              onClick={() => setMoreMenuOpen((o) => !o)}
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium whitespace-nowrap transition-colors hover:text-primary',
                moreLinks.some((l) => l.to === location.pathname) ? 'text-primary font-semibold' : 'text-foreground/70',
                lang === 'ta' && 'font-tamil',
              )}
            >
              {nav.more}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', moreMenuOpen && 'rotate-180')} />
            </button>
            {moreMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-60 max-h-[70vh] overflow-y-auto rounded-lg border bg-white shadow-lg py-1 z-50">
                {moreLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMoreMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block px-4 py-2 text-xs font-medium transition-colors hover:bg-muted whitespace-nowrap',
                        isActive ? 'text-primary font-semibold' : 'text-foreground/70',
                        lang === 'ta' && 'font-tamil',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <Link to="/contact" className="shrink-0">
            <Button size="sm" className={cn('h-8 text-xs whitespace-nowrap', lang === 'ta' && 'font-tamil')}>
              {nav.contact}
            </Button>
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <Input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={nav.searchPlaceholder}
                className="h-8 w-48 text-sm"
              />
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Language Switcher */}
          <div ref={langMenuRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLangMenuOpen((o) => !o)}
              title={nav.language}
              className="relative h-9 w-9"
            >
              <Globe className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold bg-primary text-white rounded px-0.5 leading-tight">
                {lang === 'en' ? 'EN' : 'த'}
              </span>
            </Button>
            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border bg-white shadow-lg py-1 z-50">
                <button
                  onClick={() => handleLangSelect('en')}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors',
                    lang === 'en' && 'text-primary font-semibold',
                  )}
                >
                  <span className="text-base">🇬🇧</span> English
                </button>
                <button
                  onClick={() => handleLangSelect('ta')}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors font-tamil',
                    lang === 'ta' && 'text-primary font-semibold',
                  )}
                >
                  <span className="text-base">🇮🇳</span> தமிழ்
                </button>
              </div>
            )}
          </div>

          {/* Announcements */}
          {isAuthenticated && (
            <Link to="/announcements" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9" title={nav.announcements}>
                <Bell className={cn('h-5 w-5', announcementCount > 0 && 'animate-bounce')} />
                {announcementCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 flex items-center justify-center text-[10px] bg-amber-500 animate-pulse">
                    {announcementCount > 9 ? '9+' : announcementCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {/* Wishlist */}
          <Link to={isAuthenticated ? '/wishlist' : '/auth/login'} className="relative">
            <Button variant="ghost" size="icon" className="h-9 w-9" title={nav.wishlist}>
              <Heart className={cn('h-5 w-5', wishlistCount > 0 && 'fill-red-500 text-red-500')} />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-500">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* My Orders */}
          <Link to={isAuthenticated ? '/orders' : '/auth/login'} title={nav.myOrders}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Package className="h-5 w-5" />
            </Button>
          </Link>

          {/* Cart */}
          <Link to={isAuthenticated ? '/cart' : '/auth/login'} className="relative">
            <Button variant="ghost" size="icon" className="h-9 w-9" title={nav.cart}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative">
              <Button
                size="icon"
                variant="default"
                className="hidden sm:flex h-9 w-9 rounded-full p-0 font-semibold uppercase bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setUserMenuOpen((o) => !o)}
                title={user?.name}
              >
                {user?.name?.trim()?.[0] || <User className="h-4 w-4" />}
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border bg-white shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className={cn('flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors', lang === 'ta' && 'font-tamil')}
                  >
                    <User className="h-4 w-4" /> {nav.myProfile}
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className={cn('flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors', lang === 'ta' && 'font-tamil')}
                  >
                    <Package className="h-4 w-4" /> {nav.myOrders}
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setUserMenuOpen(false)}
                    className={cn('flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors', lang === 'ta' && 'font-tamil')}
                  >
                    <Heart className="h-4 w-4" /> {nav.wishlist}
                  </Link>
                  <Link
                    to="/announcements"
                    onClick={() => setUserMenuOpen(false)}
                    className={cn('flex items-center justify-between gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors', lang === 'ta' && 'font-tamil')}
                  >
                    <span className="flex items-center gap-2"><Bell className="h-4 w-4" /> {nav.announcements}</span>
                    {announcementCount > 0 && (
                      <Badge className="h-4 min-w-4 px-1 flex items-center justify-center text-[10px] bg-amber-500">
                        {announcementCount > 9 ? '9+' : announcementCount}
                      </Badge>
                    )}
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'staff') && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className={cn('flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors border-t', lang === 'ta' && 'font-tamil')}
                    >
                      {nav.dashboard}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={cn('w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors border-t', lang === 'ta' && 'font-tamil')}
                  >
                    <LogOut className="h-4 w-4" /> {nav.signOut}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div ref={userMenuRef} className="relative hidden sm:block">
              <Button
                size="icon"
                variant="default"
                className="h-9 w-9 rounded-full p-0 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setUserMenuOpen((o) => !o)}
                title={nav.signIn}
              >
                <User className="h-4 w-4" />
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border bg-white shadow-lg py-1 z-50">
                  <Link
                    to="/auth/login"
                    onClick={() => setUserMenuOpen(false)}
                    className={cn('block px-4 py-2 text-sm hover:bg-muted transition-colors', lang === 'ta' && 'font-tamil')}
                  >
                    {nav.signIn}
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setUserMenuOpen(false)}
                    className={cn('block px-4 py-2 text-sm hover:bg-muted transition-colors', lang === 'ta' && 'font-tamil')}
                  >
                    {nav.register}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="xl:hidden border-t bg-white px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn('text-sm font-medium py-1', isActive ? 'text-primary' : 'text-foreground/70', lang === 'ta' && 'font-tamil')
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className={cn('w-full', lang === 'ta' && 'font-tamil')}>{nav.contact}</Button>
          </Link>
          <div className="border-t pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className={cn('text-sm flex items-center gap-2 py-1', lang === 'ta' && 'font-tamil')}>
                  <User className="h-4 w-4" /> {nav.myProfile}
                </Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className={cn('text-sm flex items-center gap-2 py-1', lang === 'ta' && 'font-tamil')}>
                  <Package className="h-4 w-4" /> {nav.myOrders}
                </Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className={cn('text-sm flex items-center gap-2 py-1', lang === 'ta' && 'font-tamil')}>
                  <Heart className="h-4 w-4" /> {nav.wishlist}
                </Link>
                <Link to="/announcements" onClick={() => setMobileOpen(false)} className={cn('text-sm flex items-center gap-2 py-1', lang === 'ta' && 'font-tamil')}>
                  <Bell className="h-4 w-4" /> {nav.announcements}
                  {announcementCount > 0 && (
                    <Badge className="h-4 min-w-4 px-1 flex items-center justify-center text-[10px] bg-amber-500">
                      {announcementCount > 9 ? '9+' : announcementCount}
                    </Badge>
                  )}
                </Link>
                <button onClick={handleLogout} className={cn('text-sm flex items-center gap-2 py-1 text-destructive', lang === 'ta' && 'font-tamil')}>
                  <LogOut className="h-4 w-4" /> {nav.signOut}
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" variant="outline" className={cn('w-full', lang === 'ta' && 'font-tamil')}>{nav.signIn}</Button>
                </Link>
                <Link to="/auth/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className={cn('w-full', lang === 'ta' && 'font-tamil')}>{nav.register}</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, BookOpen, Heart, Package, LogOut, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/books', label: 'Books' },
  { to: '/authors', label: 'Authors' },
  { to: '/blog', label: 'Blog' },
  { to: '/vaalu-tv', label: 'Vaalu TV' },
  { to: '/gifts', label: '🎁 Gifts' },
  { to: '/offers', label: 'Offers' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const { itemCount, clearCart } = useCart()
  const { itemCount: wishlistCount, clearWishlist } = useWishlist()
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
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
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive ? 'text-primary font-semibold' : 'text-foreground/70',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <Input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors..."
                className="h-8 w-48 text-sm"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Wishlist */}
          <Link to={isAuthenticated ? '/wishlist' : '/auth/login'} className="relative">
            <Button variant="ghost" size="icon" title="Wishlist">
              <Heart className={cn('h-5 w-5', wishlistCount > 0 && 'fill-red-500 text-red-500')} />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-500">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* My Orders */}
          <Link to={isAuthenticated ? '/orders' : '/auth/login'} title="My Orders">
            <Button variant="ghost" size="icon">
              <Package className="h-5 w-5" />
            </Button>
          </Link>

          {/* Cart */}
          <Link to={isAuthenticated ? '/cart' : '/auth/login'} className="relative">
            <Button variant="ghost" size="icon" title="Cart">
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
                size="sm"
                variant="outline"
                className="hidden sm:flex items-center gap-1.5"
                onClick={() => setUserMenuOpen((o) => !o)}
              >
                <User className="h-4 w-4" />
                {user?.name?.split(' ')[0]}
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border bg-white shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'staff') && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors border-t"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors border-t"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/auth/login">
                <Button size="sm" variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn('text-sm font-medium py-1', isActive ? 'text-primary' : 'text-foreground/70')
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm flex items-center gap-2 py-1">
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-sm flex items-center gap-2 py-1">
                  <Package className="h-4 w-4" /> My Orders
                </Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="text-sm flex items-center gap-2 py-1">
                  <Heart className="h-4 w-4" /> Wishlist
                </Link>
                <button onClick={handleLogout} className="text-sm flex items-center gap-2 py-1 text-destructive">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import SearchBar from './SearchBar'
import { brandConfig } from '@/config/brand'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=featured', label: 'Collections' },
  { to: '/custom-tshirt', label: 'Custom T-Shirt' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const cartCount = useCartStore((s) => s.count())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-navbar/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-[0_1px_0_rgba(255,255,255,0.08)]' : ''}`}>
      <div className="container-x flex h-16 items-center justify-between lg:h-20">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Link to="/" className="font-display text-xl lg:text-2xl uppercase tracking-tightest">
          {brandConfig.name}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-xs font-semibold uppercase tracking-widest2 transition-colors ${isActive ? 'text-accent' : 'text-ink/70 hover:text-ink'}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 lg:gap-5">
          <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search" className="hidden sm:block">
            <Search size={19} />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative hidden sm:block">
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative">
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to={isAuthenticated ? '/account' : '/login'} aria-label="Account">
            <User size={19} />
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-ink/10 bg-navbar">
          <div className="container-x">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-72 bg-navbar p-6 animate-fade-up">
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="mb-8">
              <X size={22} />
            </button>
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)} className="text-sm font-semibold uppercase tracking-widest2">
                  {link.label}
                </Link>
              ))}
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="text-sm font-semibold uppercase tracking-widest2">
                Wishlist
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
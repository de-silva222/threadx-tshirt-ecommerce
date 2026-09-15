import { Link } from 'react-router-dom'
import { Instagram, Facebook, Music2 } from 'lucide-react'
import { brandConfig } from '@/config/brand'
import { useEffect, useState } from 'react'
import { settingsService } from '@/services/settings'

export default function Footer() {
  const [social, setSocial] = useState({ instagram: '', tiktok: '', facebook: '' })

  useEffect(() => {
    settingsService.publicSettings().then((s) => {
      setSocial({ instagram: s.instagram_url ?? '', tiktok: s.tiktok_url ?? '', facebook: s.facebook_url ?? '' })
    }).catch(() => {})
  }, [])

  return (
    <footer className="mt-24 border-t border-ink/10 bg-navbar text-ink">
      <div className="container-x py-16">
        <div className="mb-12 grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-ink/50">Shop</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-accent">All Products</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-accent">New Arrivals</Link></li>
              <li><Link to="/shop?sort=best_selling" className="hover:text-accent">Best Sellers</Link></li>
              <li><Link to="/shop?category=oversized" className="hover:text-accent">Oversized</Link></li>
              <li><Link to="/shop?category=regular-fit" className="hover:text-accent">Regular Fit</Link></li>
              <li><Link to="/shop?category=graphic-tees" className="hover:text-accent">Graphic Tees</Link></li>
              <li><Link to="/custom-tshirt" className="hover:text-accent">Custom T-Shirts</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-ink/50">Help</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/size-guide" className="hover:text-accent">Size Guide</Link></li>
              <li><Link to="/shipping" className="hover:text-accent">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-accent">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-ink/50">Company</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-accent">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-ink/50">Follow The Streetwear</h5>
            <div className="flex gap-3">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center border border-ink/20 hover:bg-accent hover:border-accent transition-colors">
                  <Instagram size={16} />
                </a>
              )}
              {social.tiktok && (
                <a href={social.tiktok} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center border border-ink/20 hover:bg-accent hover:border-accent transition-colors">
                  <Music2 size={16} />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center border border-ink/20 hover:bg-accent hover:border-accent transition-colors">
                  <Facebook size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-ink/10 pt-6 text-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brandConfig.name}. All rights reserved.</p>
          <p>Islandwide delivery across Sri Lanka.</p>
        </div>
      </div>
    </footer>
  )
}
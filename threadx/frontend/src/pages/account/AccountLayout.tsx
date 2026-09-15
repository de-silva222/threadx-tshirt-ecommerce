import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Heart, MapPin, Shirt, User, Lock, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

const LINKS = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'My Addresses', icon: MapPin },
  { to: '/account/custom-designs', label: 'Custom Designs', icon: Shirt },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/password', label: 'Password Settings', icon: Lock },
]

export default function AccountLayout() {
  const { logout } = useAuthStore()
  const pushToast = useUIStore((s) => s.pushToast)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    pushToast('You have been logged out.', 'success')
    navigate('/')
  }

  return (
    <div className="container-x py-10">
      <h1 className="mb-8 font-display text-3xl uppercase sm:text-4xl">My Account</h1>
      <div className="flex flex-col gap-10 lg:flex-row">
        <nav className="flex flex-col gap-2 lg:w-56">
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm whitespace-nowrap ${isActive ? 'bg-accent text-paper font-semibold' : 'text-ink/70 hover:bg-ink/5'}`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-3 border-t border-ink/10 px-3 py-2.5 pt-4 text-sm text-red-600 hover:bg-red-50 lg:mt-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
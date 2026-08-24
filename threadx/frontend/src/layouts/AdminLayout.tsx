import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Shirt, FolderTree, ClipboardList, Users, Palette,
  Boxes, Ticket, Star, Truck, BarChart3, Settings, LogOut, Bell,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import ToastContainer from '@/components/Toast'
import { brandConfig } from '@/config/brand'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Shirt },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/custom-designs', label: 'Custom Designs', icon: Palette },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/delivery', label: 'Delivery', icon: Truck },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-60 shrink-0 flex-col bg-navbar text-ink lg:flex">
        <div className="px-6 py-6">
          <span className="font-display text-lg uppercase tracking-tightest">{brandConfig.name}</span>
          <p className="text-[10px] uppercase tracking-widest2 text-ink/40">Admin</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${isActive ? 'bg-accent text-paper font-semibold' : 'text-ink/70 hover:bg-ink/10'}`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="mx-3 mb-6 flex items-center gap-3 px-3 py-2.5 text-sm text-ink/70 hover:bg-ink/10 rounded"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-line bg-card px-6">
          <input
            placeholder="Search…"
            className="w-64 border border-line bg-paper px-3 py-2 text-sm outline-none max-sm:hidden"
          />
          <div className="flex items-center gap-4">
            <Bell size={18} className="text-ink/50" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-paper">
                {user?.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <span className="text-sm font-medium max-sm:hidden">{user?.name ?? 'Admin'}</span>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
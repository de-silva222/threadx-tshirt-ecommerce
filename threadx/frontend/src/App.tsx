import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute'

import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Wishlist from '@/pages/Wishlist'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'
import OrderTracking from '@/pages/OrderTracking'
import CustomDesigner from '@/pages/CustomDesigner'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import SizeGuidePage from '@/pages/SizeGuidePage'
import Shipping from '@/pages/Shipping'
import Returns from '@/pages/Returns'
import FAQ from '@/pages/FAQ'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import NotFound from '@/pages/NotFound'

import AccountLayout from '@/pages/account/AccountLayout'
import AccountDashboard from '@/pages/account/Dashboard'
import AccountOrders from '@/pages/account/Orders'
import AccountOrderDetail from '@/pages/account/OrderDetail'
import AccountAddresses from '@/pages/account/Addresses'
import AccountCustomDesigns from '@/pages/account/CustomDesigns'
import AccountProfile from '@/pages/account/Profile'
import AccountPassword from '@/pages/account/PasswordSettings'

import AdminDashboard from '@/admin/pages/Dashboard'
import AdminProducts from '@/admin/pages/Products'
import AdminProductDetail from '@/admin/pages/ProductDetail'
import AdminCategories from '@/admin/pages/Categories'
import AdminOrders from '@/admin/pages/Orders'
import AdminOrderDetail from '@/admin/pages/OrderDetail'
import AdminCustomers from '@/admin/pages/Customers'
import AdminCustomDesigns from '@/admin/pages/CustomDesigns'
import AdminInventory from '@/admin/pages/Inventory'
import AdminCoupons from '@/admin/pages/Coupons'
import AdminReviews from '@/admin/pages/Reviews'
import AdminDelivery from '@/admin/pages/Delivery'
import AdminReports from '@/admin/pages/Reports'
import AdminSettings from '@/admin/pages/Settings'

import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate)
  const refreshCart = useCartStore((s) => s.refresh)
  const { isAuthenticated } = useAuthStore()
  const refreshWishlist = useWishlistStore((s) => s.refresh)

  useEffect(() => { hydrate() }, [])
  useEffect(() => { refreshCart() }, [])
  useEffect(() => { if (isAuthenticated) refreshWishlist() }, [isAuthenticated])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="custom-tshirt" element={<CustomDesigner />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          <Route path="track-order" element={<OrderTracking />} />
          <Route path="track-order/:orderNumber" element={<OrderTracking />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="size-guide" element={<SizeGuidePage />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="returns" element={<Returns />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />

          <Route path="account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            <Route index element={<AccountDashboard />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="orders/:orderNumber" element={<AccountOrderDetail />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="custom-designs" element={<AccountCustomDesigns />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="password" element={<AccountPassword />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/:id" element={<AdminProductDetail />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="custom-designs" element={<AdminCustomDesigns />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="delivery" element={<AdminDelivery />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
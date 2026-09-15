import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import CartItemRow from '@/components/CartItemRow'
import Button from '@/components/Button'
import Input from '@/components/Input'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import { formatPrice } from '@/utils/format'
import { cartService } from '@/services/cart'

export default function Cart() {
  const { items, savedForLater, subtotal, isLoading, refresh } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [applying, setApplying] = useState(false)
  const navigate = useNavigate()
  const pushToast = useUIStore((s) => s.pushToast)

  useEffect(() => { refresh() }, [])

  async function applyCoupon() {
    setApplying(true)
    setCouponError('')
    try {
      const res = await cartService.applyCoupon(couponCode)
      setDiscount(res.discount)
      pushToast(`Coupon "${res.code}" applied.`, 'success')
    } catch (e: any) {
      setCouponError(e.response?.data?.message ?? 'Invalid coupon.')
      setDiscount(0)
    } finally {
      setApplying(false)
    }
  }

  if (isLoading) return <LoadingSpinner full />

  if (items.length === 0) {
    return (
      <div className="container-x py-10">
        <EmptyState
          icon={<ShoppingBag size={40} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={<Link to="/shop" className="btn-primary mt-2">Start Shopping</Link>}
        />
      </div>
    )
  }

  const total = Math.max(0, subtotal - discount)

  return (
    <div className="container-x py-10">
      <h1 className="mb-8 font-display text-3xl uppercase sm:text-4xl">Your Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item) => <CartItemRow key={item.id} item={item} />)}

          {savedForLater.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl uppercase">Saved For Later</h2>
              {savedForLater.map((item) => <CartItemRow key={item.id} item={item} />)}
            </div>
          )}
        </div>

        <div className="h-fit border border-ink/10 p-6">
          <h2 className="mb-5 font-display text-lg uppercase">Order Summary</h2>
          <div className="mb-4 flex gap-2">
            <Input placeholder="Enter Coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} error={couponError} />
            <Button variant="secondary" onClick={applyCoupon} loading={applying}>Apply</Button>
          </div>
          <div className="space-y-2.5 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between text-ink/60"><span>Delivery</span><span>Calculated at checkout</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 text-base font-bold">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <Button variant="primary" className="mt-6 w-full" onClick={() => navigate('/checkout', { state: { couponCode: discount > 0 ? couponCode : undefined } })}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}

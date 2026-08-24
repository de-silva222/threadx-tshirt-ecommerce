import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { orderService } from '@/services/orders'
import { settingsService } from '@/services/settings'
import { apiErrorMessage } from '@/services/api'
import { formatPrice } from '@/utils/format'
import { SRI_LANKA_DISTRICTS } from '@/utils/districts'

export default function Checkout() {
  const { items, subtotal, refresh } = useCartStore()
  const { user } = useAuthStore()
  const pushToast = useUIStore((s) => s.pushToast)
  const navigate = useNavigate()
  const location = useLocation() as any
  const couponCode: string | undefined = location.state?.couponCode

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: user?.email ?? '', phone: user?.phone ?? '',
    address_line: '', city: '', district: 'Colombo', postal_code: '',
    payment_method: 'cod' as 'cod' | 'online',
  })
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [freeThreshold, setFreeThreshold] = useState(5000)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { refresh() }, [])

  useEffect(() => {
    settingsService.shippingRates().then((rates) => {
      const match = rates.find((r) => r.district === form.district)
      setDeliveryFee(match?.fee ?? 350)
    })
    settingsService.publicSettings().then((s) => setFreeThreshold(Number(s.free_delivery_threshold ?? 5000)))
  }, [form.district])

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const effectiveDelivery = subtotal >= freeThreshold ? 0 : deliveryFee
  const estimatedTotal = subtotal + effectiveDelivery // final discount/total is authoritative from server

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const order = await orderService.create({
        ...form,
        items: items.map((i) => ({
          type: i.type,
          id: i.type === 'variant' ? (i.variant_id as number) : (i.design_id as number),
          quantity: i.quantity,
        })),
        coupon_code: couponCode,
        clear_cart: true,
      })
      pushToast('Order placed successfully!', 'success')
      navigate(`/order-confirmation/${order.order_number}`)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not place your order.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="container-x py-10">
      <h1 className="mb-8 font-display text-3xl uppercase sm:text-4xl">Checkout</h1>
      <form onSubmit={submit} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h2 className="mb-4 font-display text-lg uppercase">Customer Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="First Name" required value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
              <Input label="Last Name" required value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
              <Input label="Email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
              <Input label="Phone" required placeholder="+94 77 123 4567" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg uppercase">Delivery Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Address" required value={form.address_line} onChange={(e) => update('address_line', e.target.value)} />
              </div>
              <Input label="City" required value={form.city} onChange={(e) => update('city', e.target.value)} />
              <Select label="District" value={form.district} onChange={(e) => update('district', e.target.value)}>
                {SRI_LANKA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
              <Input label="Postal Code" value={form.postal_code} onChange={(e) => update('postal_code', e.target.value)} />
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg uppercase">Payment</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 border border-ink/15 p-4 cursor-pointer has-[:checked]:border-ink">
                <input type="radio" name="payment" checked={form.payment_method === 'cod'} onChange={() => update('payment_method', 'cod')} />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 border border-ink/15 p-4 cursor-pointer has-[:checked]:border-ink">
                <input type="radio" name="payment" checked={form.payment_method === 'online'} onChange={() => update('payment_method', 'online')} />
                <span className="text-sm font-medium">Online Payment (PayHere)</span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="h-fit border border-ink/10 p-6">
          <h2 className="mb-5 font-display text-lg uppercase">Order Summary</h2>
          <ul className="mb-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span className="text-ink/60">{i.name} ({i.size}) × {i.quantity}</span>
                <span>{formatPrice(i.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink/60">Delivery</span><span>{effectiveDelivery === 0 ? 'Free' : formatPrice(effectiveDelivery)}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 text-base font-bold">
            <span>Estimated Total</span><span>{formatPrice(estimatedTotal)}</span>
          </div>
          <p className="mt-2 text-[11px] text-ink/40">Final total (with any coupon) is confirmed after placing your order.</p>
          <Button type="submit" variant="primary" className="mt-6 w-full" loading={submitting}>Place Order</Button>
        </div>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { orderService } from '@/services/orders'
import OrderTimeline from '@/components/OrderTimeline'
import Input from '@/components/Input'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

export default function OrderTracking() {
  const { orderNumber } = useParams()
  const navigate = useNavigate()
  const [lookup, setLookup] = useState('')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (orderNumber) load(orderNumber)
  }, [orderNumber])

  function load(id: string) {
    setLoading(true)
    setError('')
    orderService.track(id)
      .then(setData)
      .catch(() => setError('We could not find an order with that number.'))
      .finally(() => setLoading(false))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (lookup.trim()) navigate(`/track-order/${lookup.trim()}`)
  }

  return (
    <div className="container-x max-w-xl py-10">
      <h1 className="mb-8 font-display text-3xl uppercase sm:text-4xl">Track Your Order</h1>

      {!orderNumber && (
        <form onSubmit={submit} className="mb-8 flex gap-2">
          <Input placeholder="Order Number, e.g. TS10001" value={lookup} onChange={(e) => setLookup(e.target.value)} />
          <Button type="submit">Track</Button>
        </form>
      )}

      {loading && <LoadingSpinner full />}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-4">
            <div>
              <p className="text-sm text-ink/50">Order</p>
              <p className="font-bold">{data.order_number}</p>
            </div>
            {data.tracking_number && (
              <div className="text-right">
                <p className="text-sm text-ink/50">{data.courier_name}</p>
                <p className="font-bold">{data.tracking_number}</p>
              </div>
            )}
          </div>
          <OrderTimeline timeline={data.timeline} cancelled={data.cancelled} />
        </div>
      )}
    </div>
  )
}

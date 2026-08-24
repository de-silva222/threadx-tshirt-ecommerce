import { Trash2, Heart } from 'lucide-react'
import type { CartItem } from '@/types'
import { formatPrice } from '@/utils/format'
import QuantitySelector from './QuantitySelector'
import { useCartStore } from '@/store/cartStore'

export default function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, remove, toggleSaveForLater } = useCartStore()

  return (
    <div className="flex gap-4 border-b border-ink/10 py-5">
      <div className="img-luxury-frame-sm h-24 w-20 shrink-0 overflow-hidden bg-ink/5">
        {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-sm font-semibold">{item.name}</p>
          <p className="text-xs text-ink/50">{item.color} / {item.size}</p>
          {item.stock !== null && item.stock !== undefined && item.stock < 5 && (
            <p className="text-xs text-red-600 mt-0.5">Only {item.stock} left</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} max={item.stock ?? undefined} />
          <p className="text-sm font-bold">{formatPrice(item.subtotal)}</p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button onClick={() => remove(item.id)} aria-label="Remove item" className="text-ink/40 hover:text-red-600">
          <Trash2 size={16} />
        </button>
        <button onClick={() => toggleSaveForLater(item.id, !item.saved_for_later)} aria-label="Save for later" className="text-ink/40 hover:text-ink">
          <Heart size={16} className={item.saved_for_later ? 'fill-ink' : ''} />
        </button>
      </div>
    </div>
  )
}
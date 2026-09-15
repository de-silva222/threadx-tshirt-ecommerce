import { useState } from 'react'
import type { ProductImage } from '@/types'
import FadeImage from './FadeImage'

export default function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [active, setActive] = useState(0)
  const list = images.length ? images : [{ id: 0, url: '', type: 'front' as const, sort_order: 0 }]

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible">
        {list.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={`img-luxury-frame-sm group h-16 w-14 sm:h-20 sm:w-16 shrink-0 overflow-hidden border-2 bg-ink/5 ${active === i ? 'border-ink' : 'border-transparent'}`}
          >
            {img.url && <FadeImage src={img.url} alt={`${productName} ${img.type}`} className="h-full w-full object-cover" zoom={false} />}
          </button>
        ))}
      </div>
      <div className="img-luxury-frame group flex-1 aspect-[4/5] overflow-hidden bg-ink/5">
        {list[active]?.url ? (
          <FadeImage key={list[active].id} src={list[active].url} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/20 text-xs uppercase tracking-widest2">No Image</div>
        )}
      </div>
    </div>
  )
}
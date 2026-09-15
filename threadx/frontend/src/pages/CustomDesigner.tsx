import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Check } from 'lucide-react'
import Button from '@/components/Button'
import Select from '@/components/Select'
import { customDesignService } from '@/services/customDesigns'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/format'
import type { PrintPosition } from '@/types'

const TYPES = [
  { value: 'regular', label: 'Regular Fit', base: 2990 },
  { value: 'oversized', label: 'Oversized', base: 3290 },
]
const COLORS = [
  { name: 'Black', hex: '#0A0A0A' },
  { name: 'White', hex: '#FAFAFA' },
  { name: 'Grey', hex: '#737373' },
  { name: 'Navy', hex: '#1C2733' },
]
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const FONTS = ['Inter', 'Anton', 'Georgia', 'Courier New']
const POSITIONS: { value: PrintPosition; label: string }[] = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'left_chest', label: 'Left Chest' },
  { value: 'right_chest', label: 'Right Chest' },
]

const STEPS = ['Type', 'Color', 'Size', 'Upload', 'Text', 'Position', 'Preview']

export default function CustomDesigner() {
  const [step, setStep] = useState(0)
  const [tshirtType, setTshirtType] = useState<'regular' | 'oversized'>('regular')
  const [color, setColor] = useState('Black')
  const [size, setSize] = useState('M')
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [designImagePreview, setDesignImagePreview] = useState<string | null>(null)
  const [customText, setCustomText] = useState('')
  const [font, setFont] = useState('Inter')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [position, setPosition] = useState<PrintPosition>('front')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { addCustomDesign } = useCartStore()
  const pushToast = useUIStore((s) => s.pushToast)
  const navigate = useNavigate()

  const colorHex = COLORS.find((c) => c.name === color)?.hex ?? '#0A0A0A'
  const basePrice = TYPES.find((t) => t.value === tshirtType)?.base ?? 2990
  const imageFee = designImage ? 650 : 0
  const textFee = customText ? 450 : 0
  const comboDiscount = designImage && customText ? 150 : 0
  const total = basePrice + imageFee + textFee - comboDiscount

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      pushToast('Please upload a PNG, JPG, or WEBP file.', 'error')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      pushToast('File too large. Maximum size is 8MB.', 'error')
      return
    }

    setDesignImagePreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await customDesignService.uploadImage(file)
      setDesignImage(url)
    } catch {
      pushToast('Upload failed. Please try a different file.', 'error')
      setDesignImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  async function addToCart() {
    if (!designImage && !customText) {
      pushToast('Add an image or custom text before continuing.', 'error')
      return
    }
    setSaving(true)
    try {
      const design = await customDesignService.save({
        tshirt_type: tshirtType,
        color,
        size: size as any,
        design_image: designImage,
        custom_text: customText || undefined,
        font,
        text_color: textColor,
        print_position: position,
      })
      await addCustomDesign(design.id, 1)
      pushToast('Custom T-shirt added to cart!', 'success')
      navigate('/cart')
    } catch {
      pushToast('Could not save your design. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const textAlign: Record<PrintPosition, string> = {
    front: 'items-center justify-center',
    back: 'items-center justify-center',
    left_chest: 'items-start justify-start pt-8 pl-6',
    right_chest: 'items-start justify-end pt-8 pr-6',
  }

  return (
    <div className="container-x py-10">
      <h1 className="mb-2 font-display text-3xl uppercase sm:text-4xl">Custom T-Shirt Designer</h1>
      <p className="mb-8 text-sm text-ink/50">Design something that's uniquely yours — step by step.</p>

      <div className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest2 ${i === step ? 'bg-accent text-paper' : i < step ? 'bg-ink/10 text-ink' : 'text-ink/30'}`}
          >
            {i < step && <Check size={12} />} {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* PREVIEW MOCKUP */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-24 aspect-[4/5] flex items-center justify-center" style={{ backgroundColor: colorHex === '#FAFAFA' ? '#EFEFEF' : '#F5F5F4' }}>
            <div className={`relative flex h-[85%] w-[70%] ${textAlign[position]}`} style={{ backgroundColor: colorHex, clipPath: 'polygon(20% 0%, 35% 8%, 40% 0%, 60% 0%, 65% 8%, 80% 0%, 100% 12%, 88% 22%, 82% 18%, 82% 100%, 18% 100%, 18% 18%, 12% 22%, 0% 12%)' }}>
              {designImagePreview && (position === 'front' || position === 'back') && (
                <img src={designImagePreview} alt="Design preview" className="max-h-[45%] max-w-[55%] object-contain" />
              )}
              {designImagePreview && (position === 'left_chest' || position === 'right_chest') && (
                <img src={designImagePreview} alt="Design preview" className="h-12 w-12 object-contain" />
              )}
              {customText && (
                <p className="mt-2 max-w-[80%] text-center break-words" style={{ color: textColor, fontFamily: font, fontSize: position.includes('chest') ? 10 : 20, fontWeight: 700 }}>
                  {customText}
                </p>
              )}
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-ink/40">Live preview — {tshirtType === 'oversized' ? 'Oversized' : 'Regular'} · {color} · {size} · {POSITIONS.find(p => p.value === position)?.label}</p>
        </div>

        {/* STEPS */}
        <div className="order-2 space-y-8 lg:order-1">
          {step === 0 && (
            <div>
              <h2 className="mb-4 font-display text-lg uppercase">Choose T-Shirt Type</h2>
              <div className="grid grid-cols-2 gap-3">
                {TYPES.map((t) => (
                  <button key={t.value} onClick={() => setTshirtType(t.value as any)} className={`border p-4 text-left ${tshirtType === t.value ? 'border-ink bg-ink/5' : 'border-ink/15'}`}>
                    <p className="font-semibold text-sm">{t.label}</p>
                    <p className="text-xs text-ink/50">{formatPrice(t.base)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="mb-4 font-display text-lg uppercase">Choose Color</h2>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} className={`h-12 w-12 rounded-full border-2 ${color === c.name ? 'border-ink' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} aria-label={c.name} />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-4 font-display text-lg uppercase">Choose Size</h2>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`h-11 w-14 border text-sm font-semibold ${size === s ? 'border-accent bg-accent text-paper' : 'border-ink/20'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-4 font-display text-lg uppercase">Upload Your Design</h2>
              <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleFileChange} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="flex w-full flex-col items-center gap-2 border-2 border-dashed border-ink/20 py-10 hover:border-ink/40">
                <Upload size={24} className="text-ink/40" />
                <span className="text-sm font-semibold">{uploading ? 'Uploading…' : designImage ? 'Replace file' : 'Click to upload PNG, JPG, or WEBP'}</span>
                <span className="text-xs text-ink/40">Max 8MB</span>
              </button>
              {designImage && <p className="mt-2 text-xs text-green-700">✓ Design uploaded</p>}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg uppercase">Add Custom Text</h2>
              <input
                value={customText}
                onChange={(e) => setCustomText(e.target.value.slice(0, 40))}
                placeholder="Your text (max 40 characters)"
                className="w-full border border-ink/15 px-4 py-3 text-sm outline-none focus:border-ink"
              />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Font" value={font} onChange={(e) => setFont(e.target.value)}>
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </Select>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-ink/60">Text Color</label>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-11 w-full border border-ink/15" />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="mb-4 font-display text-lg uppercase">Choose Print Position</h2>
              <div className="grid grid-cols-2 gap-3">
                {POSITIONS.map((p) => (
                  <button key={p.value} onClick={() => setPosition(p.value)} className={`border p-4 text-sm font-semibold ${position === p.value ? 'border-ink bg-ink/5' : 'border-ink/15'}`}>{p.label}</button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="mb-4 font-display text-lg uppercase">Preview &amp; Price</h2>
              <div className="space-y-2 border border-ink/10 p-5 text-sm">
                <div className="flex justify-between"><span className="text-ink/60">Base T-shirt ({tshirtType})</span><span>{formatPrice(basePrice)}</span></div>
                {imageFee > 0 && <div className="flex justify-between"><span className="text-ink/60">Custom printing (image)</span><span>{formatPrice(imageFee)}</span></div>}
                {textFee > 0 && <div className="flex justify-between"><span className="text-ink/60">Custom printing (text)</span><span>{formatPrice(textFee)}</span></div>}
                {comboDiscount > 0 && <div className="flex justify-between text-green-700"><span>Combo discount</span><span>-{formatPrice(comboDiscount)}</span></div>}
                <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              <Button variant="accent" className="mt-6 w-full" loading={saving} onClick={addToCart}>Add Custom T-Shirt to Cart</Button>
            </div>
          )}

          <div className="flex justify-between border-t border-ink/10 pt-6">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
            {step < STEPS.length - 1 && <Button variant="secondary" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Next</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
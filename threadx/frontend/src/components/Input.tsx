import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', id, ...rest }, ref) => {
  const inputId = id || rest.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-ink/60">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full border ${error ? 'border-red-500' : 'border-ink/15'} bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors ${className}`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'
export default Input

import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, children, className = '', id, ...rest }, ref) => {
  const selectId = id || rest.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-ink/60">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  )
})
Select.displayName = 'Select'
export default Select

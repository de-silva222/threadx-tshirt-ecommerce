import { useState } from 'react'

/**
 * Drop-in <img> replacement: fades in once loaded, and (optionally) applies
 * a subtle zoom-on-hover. Zoom relies on a `group` class on the ancestor
 * element — wrap the image in a container with `group` and `overflow-hidden`.
 */
export default function FadeImage({
  src,
  alt,
  className = '',
  zoom = true,
  fallback,
}: {
  src?: string | null
  alt: string
  className?: string
  zoom?: boolean
  fallback?: React.ReactNode
}) {
  const [loaded, setLoaded] = useState(false)

  if (!src) {
    return fallback ? <>{fallback}</> : null
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={[
        className,
        'transition-[opacity,transform] duration-700 ease-out',
        loaded ? 'opacity-100' : 'opacity-0',
        zoom ? 'group-hover:scale-105' : '',
      ].join(' ')}
    />
  )
}
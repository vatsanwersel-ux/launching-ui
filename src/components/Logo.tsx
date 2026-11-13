import { useId } from 'react'
import { content } from '../config/content'

/** Champagne "G" mark + wordmark. Swap the <svg> for your real logo file when ready. */
export function Logo() {
  const gradId = useId()
  return (
    <a className="logo" href="/" aria-label={content.brand.homeLabel}>
      <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-champagne-200)" />
            <stop offset="0.5" stopColor="var(--color-gold-400)" />
            <stop offset="1" stopColor="var(--color-gold-600)" />
          </linearGradient>
        </defs>
        <path d="M29.9 10.1A14 14 0 1 0 34 20H21" fill="none" stroke={`url(#${gradId})`} strokeWidth="5" />
      </svg>
      <span className="logo__word">{content.brand.name}</span>
    </a>
  )
}

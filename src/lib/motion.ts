import type { Variants } from 'motion/react'

/** Same curve as --ease-out in tokens.css */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const stagger = (each = 0.12, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
})

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE_OUT },
  },
}

/** Masked line reveal: the line slides up from behind its own baseline. */
export const lineRise: Variants = {
  hidden: { y: '115%', rotate: 2 },
  show: { y: '0%', rotate: 0, transition: { duration: 1.25, ease: EASE_OUT } },
}

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.4, ease: EASE_OUT, delay } },
})

import { motion } from 'motion/react'
import { EASE_OUT } from '../lib/motion'
import { Logo } from './Logo'
import './Header.css'

export function Header() {
  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
    >
      <Logo />
    </motion.header>
  )
}

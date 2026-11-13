import { motion } from 'motion/react'
import { content } from '../config/content'
import { EASE_OUT } from '../lib/motion'
import './Footer.css'

export function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: EASE_OUT, delay: 1.8 }}
    >
      <span>{content.footer.copyright}</span>
      <span>{content.footer.tagline}</span>
    </motion.footer>
  )
}

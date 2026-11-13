import { motion } from 'motion/react'
import { content } from '../config/content'
import { fadeUp } from '../lib/motion'

export function StatusChip() {
  return (
    <motion.p className="chip glass" variants={fadeUp}>
      <span className="chip__dot" aria-hidden="true" />
      {content.badge}
    </motion.p>
  )
}

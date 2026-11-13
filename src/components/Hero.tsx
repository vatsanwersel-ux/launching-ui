import { motion } from 'motion/react'
import { content } from '../config/content'
import { fadeUp, stagger } from '../lib/motion'
import { Headline } from './Headline'
import { NotifyForm } from './NotifyForm'
import { StatusChip } from './StatusChip'
import './Hero.css'

export function Hero() {
  const { lede } = content
  return (
    <motion.section className="hero" variants={stagger(0.16, 0.6)} initial="hidden" animate="show">
      <StatusChip />
      <Headline />
      <motion.p className="lede" variants={fadeUp}>
        <strong>{lede.brand}</strong>
        {lede.text}
      </motion.p>
      <NotifyForm />
    </motion.section>
  )
}

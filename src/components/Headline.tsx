import { Fragment } from 'react'
import { motion } from 'motion/react'
import { content } from '../config/content'
import { lineRise, stagger } from '../lib/motion'

export function Headline() {
  return (
    <motion.h1 className="headline" variants={stagger(0.14)}>
      {content.headline.lines.map((line, i) => (
        <span className="headline__mask" key={i}>
          <motion.span className="headline__line" variants={lineRise}>
            {line.map((seg, j) =>
              seg.accent ? (
                <em key={j} className="headline__accent text-metal">
                  {seg.text}
                </em>
              ) : (
                <Fragment key={j}>{seg.text}</Fragment>
              ),
            )}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}

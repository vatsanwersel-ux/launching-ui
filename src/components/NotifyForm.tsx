import { useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { content } from '../config/content'
import { EASE_OUT, fadeUp } from '../lib/motion'
import { joinWaitlist } from '../lib/waitlist'
import { ArrowRightIcon, CheckIcon, MailIcon } from './icons'
import './NotifyForm.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Status = 'idle' | 'loading' | 'success'

export function NotifyForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const inputId = useId()
  const metaId = useId()
  const { form } = content

  const fail = (message: string) => {
    setError(message)
    if (scope.current) {
      animate(scope.current, { x: [0, -7, 7, -4, 4, 0] }, { duration: 0.45, ease: 'easeInOut' })
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return
    const value = email.trim()
    if (!EMAIL_RE.test(value)) return fail(form.errors.invalid)

    setError(null)
    setStatus('loading')
    try {
      await joinWaitlist(value)
      setStatus('success')
    } catch {
      setStatus('idle')
      fail(form.errors.failed)
    }
  }

  const loading = status === 'loading'

  return (
    <motion.div className="notify-wrap" variants={fadeUp}>
      <div className="notify-slot" ref={scope}>
        <AnimatePresence mode="wait" initial={false}>
          {status !== 'success' ? (
            <motion.form
              key="form"
              className={`notify glass${error ? ' notify--error' : ''}`}
              onSubmit={onSubmit}
              noValidate
              exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <label htmlFor={inputId} className="sr-only">
                {form.label}
              </label>
              <MailIcon className="notify__icon" />
              <input
                id={inputId}
                className="notify__input"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={form.placeholder}
                value={email}
                disabled={loading}
                aria-invalid={error ? true : undefined}
                aria-describedby={metaId}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
              />
              <button className="btn-gold" type="submit" disabled={loading} aria-busy={loading}>
                <span>{form.button}</span>
                {loading ? (
                  <span className="spinner" aria-hidden="true" />
                ) : (
                  <ArrowRightIcon className="btn-gold__icon" />
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              className="notify notify--success glass"
              role="status"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <motion.span
                className="notify__check"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.25 }}
              >
                <CheckIcon />
              </motion.span>
              <span>{form.success}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="notify__meta" id={metaId}>
        <AnimatePresence mode="wait" initial={false}>
          {status !== 'success' && (
            <motion.p
              key={error ?? 'note'}
              className={error ? 'notify__error' : 'notify__note'}
              role={error ? 'alert' : undefined}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              {error ?? form.note}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

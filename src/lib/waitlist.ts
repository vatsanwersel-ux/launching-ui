import emailjs from '@emailjs/browser'
import { content } from '../config/content'
import { site } from '../config/site'

/** Company domain from the email, or "Personal email" for Gmail, Yahoo, etc. */
function leadCompany(email: string): string {
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  return site.personalEmailDomains.includes(domain) ? content.lead.personalEmail : domain
}

/** Where the lead came from, plus utm_source when the link carried one (ads, Instagram, …). */
function leadSource(): string {
  const utm = new URLSearchParams(window.location.search).get('utm_source')
  return utm ? `${content.lead.source} · ${utm}` : content.lead.source
}

function signupTime(): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: site.leadTimeZone,
    timeZoneName: 'short',
  }).format(new Date())
}

/**
 * Sends one lead email to the team through EmailJS.
 * Recipients are set in the EmailJS template, so one request reaches everyone.
 * Without EmailJS keys in .env it runs in demo mode and sends nothing.
 */
export async function joinWaitlist(email: string): Promise<void> {
  const { serviceId, leadTemplateId, publicKey } = site.emailjs

  if (!serviceId || !leadTemplateId || !publicKey) {
    await new Promise((resolve) => setTimeout(resolve, 1100))
    return
  }

  await emailjs.send(
    serviceId,
    leadTemplateId,
    {
      user_email: email,
      lead_company: leadCompany(email),
      lead_source: leadSource(),
      signup_time: signupTime(),
    },
    { publicKey },
  )
}

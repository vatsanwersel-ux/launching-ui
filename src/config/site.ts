/**
 * Non-text settings. EmailJS keys come from .env (see .env.example).
 * Lead recipients are NOT set here: they live in the EmailJS template's
 * "To Email" field, so team addresses never ship in the public JS bundle.
 */
export const site = {
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
    leadTemplateId: import.meta.env.VITE_EMAILJS_LEAD_TEMPLATE_ID ?? '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
  },
  /** Time zone used for the "Received" time in lead emails */
  leadTimeZone: 'Asia/Kolkata',
  /** Domains treated as personal (not a company) when tagging leads */
  personalEmailDomains: [
    'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.in', 'ymail.com', 'outlook.com', 'hotmail.com',
    'live.com', 'msn.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com',
    'rediffmail.com', 'zoho.com', 'zohomail.in', 'gmx.com', 'mail.com', 'yandex.com',
  ],
}

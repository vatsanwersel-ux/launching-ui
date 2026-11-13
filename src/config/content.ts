/**
 * All user-facing text lives here. Edit copy in this one file.
 * (Also used by vite.config.ts to fill the <title> and meta description.)
 */
export const content = {
  meta: {
    title: 'Gromaxx | AI-Native Hotel Management Software, Launching Soon',
    description:
      'Gromaxx is the AI-native hotel management software built for modern hospitality. Launching soon. Join the waitlist.',
  },
  brand: {
    name: 'Gromaxx',
    homeLabel: 'Gromaxx home',
  },
  badge: 'Launching Soon',
  headline: {
    lines: [
      [{ text: 'Hotel management,', accent: false }],
      [
        { text: 'reimagined', accent: true },
        { text: ' with AI.', accent: false },
      ],
    ],
  },
  lede: {
    brand: 'Gromaxx',
    text: ' is the AI-native hotel management software built for modern hospitality.',
  },
  form: {
    label: 'Email address',
    placeholder: 'Enter your email',
    button: 'Notify me',
    note: 'Be the first to know when we launch. No spam, ever.',
    success: "You're on the list. We'll be in touch soon.",
    errors: {
      invalid: 'Please enter a valid email address.',
      failed: 'Something went wrong. Please try again.',
    },
  },
  /** Labels written into the lead email sent to the team */
  lead: {
    source: 'Launch page · Notify me',
    personalEmail: 'Personal email',
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} Gromaxx`,
    tagline: 'Smarter · Simpler · More Profitable',
  },
} as const

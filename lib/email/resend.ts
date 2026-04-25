import { Resend } from 'resend'

let _resend: Resend | null = null

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY is not set — emails will not be sent')
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? 'no-key')
  }
  return _resend
}

export const FROM = 'Marissa · Parent Coaching <marissa@parentcoachingwithmarissa.com>'
export const COACH_EMAIL = 'parentcoachwithmarissa@gmail.com'

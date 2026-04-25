import { Resend } from 'resend'

let _resend: Resend | null = null

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? 'no-key')
  }
  return _resend
}

export const FROM = 'Marissa · Parent Coaching <marissa@parentcoachingwithmarissa.com>'
export const COACH_EMAIL = 'parentcoachwithmarissa@gmail.com'

import type { Metadata } from 'next'
import HomePage from '@/app/(public)/page'

export const metadata: Metadata = {
  title: 'Reimagine Parenting | Coaching that works with your child’s brain',
  description:
    'One-on-one parent coaching for families raising neurodiverse kids ages 3–12. Built on a decade of special-education experience — not generic advice.',
  robots: { index: false, follow: false },
}

// Staging mirror of the live homepage — kept noindex for design review.
export default HomePage

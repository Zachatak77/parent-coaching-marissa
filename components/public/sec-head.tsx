import { HeartRule } from './heart-rule'
import { Pill } from './pill'

export function SecHead({
  pill,
  title,
  lede,
  pillBg,
  pillFg,
}: {
  pill: string
  title: React.ReactNode
  lede?: string
  pillBg?: string
  pillFg?: string
}) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 56px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Pill bg={pillBg} fg={pillFg}>{pill}</Pill>
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        lineHeight: 1.05,
        color: 'var(--ds-text)',
        letterSpacing: '-0.015em',
        margin: '0 0 20px',
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: lede ? 20 : 0 }}>
        <HeartRule center />
      </div>
      {lede && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: 'var(--ds-text-2)',
          lineHeight: 1.55,
          margin: 0,
        }}>
          {lede}
        </p>
      )}
    </div>
  )
}

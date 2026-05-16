export function Pill({
  children,
  bg,
  fg,
  cream,
  char,
}: {
  children: string
  bg?: string
  fg?: string
  cream?: boolean
  char?: boolean
}) {
  const background = bg ?? (cream ? 'var(--linen-ds)' : char ? 'var(--char)' : 'var(--navy)')
  const color = fg ?? (cream ? 'var(--ds-text)' : '#FFFFFF')
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '7px 22px 8px',
      background,
      color,
      borderRadius: 999,
      fontFamily: 'var(--font-ui)',
      fontWeight: 600,
      fontSize: '0.72rem',
      letterSpacing: '.18em',
      textTransform: 'uppercase' as const,
    }}>
      {children}
    </span>
  )
}

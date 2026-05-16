export function HeartRule({ light, center }: { light?: boolean; center?: boolean }) {
  const c = light ? '#FFFFFF' : 'var(--ds-text)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start', gap: 14, color: c }}>
      <div style={{ height: 1, width: 80, background: c, flexShrink: 0 }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12 21s-7.5-4.6-9.5-10.2C1.2 7.4 3.7 4 7.1 4c2 0 3.6 1 4.9 2.6C13.3 5 14.9 4 16.9 4c3.4 0 5.9 3.4 4.6 6.8C19.5 16.4 12 21 12 21z"/>
      </svg>
      <div style={{ height: 1, width: 80, background: c, flexShrink: 0 }} />
    </div>
  )
}

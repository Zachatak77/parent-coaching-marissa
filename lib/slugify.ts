export function generateSlug(title: string, existingSlugs?: string[]): string {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (existingSlugs && existingSlugs.includes(slug)) {
    // Web Crypto API — available in browsers and Node.js 18+
    const arr = new Uint8Array(2)
    crypto.getRandomValues(arr)
    const suffix = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
    return `${slug}-${suffix}`
  }

  return slug
}

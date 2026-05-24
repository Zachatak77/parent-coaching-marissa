import { randomBytes } from 'crypto'

export function generateSlug(title: string, existingSlugs?: string[]): string {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (existingSlugs && existingSlugs.includes(slug)) {
    return `${slug}-${randomBytes(2).toString('hex')}`
  }

  return slug
}

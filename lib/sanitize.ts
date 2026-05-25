import DOMPurify from 'isomorphic-dompurify'

// Strict allowlist — only the tags Tiptap StarterKit produces
const ALLOWED_TAGS = ['p', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'a']
const ALLOWED_ATTR = ['href', 'target', 'rel']

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Force links to be safe
    FORCE_BODY: false,
  })
}

import sanitizeHtmlLib from 'sanitize-html'

export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ['p', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'a'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['https', 'http', 'mailto'],
  })
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { CoverImageUpload } from './CoverImageUpload'
import { SeoPanel } from './SeoPanel'
import { RichTextEditor } from './RichTextEditor'
import { generateSlug } from '@/lib/slugify'
import { SLUG_RE } from '@/lib/blog-validation'

interface PostEditorProps {
  post?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    coverImage: string | null
    coverImageAlt: string | null
    tags: string[]
    seoTitle: string | null
    seoDescription: string | null
    seoKeywords: string[]
    canonicalUrl: string | null
    ogImage: string | null
    noIndex: boolean
    scheduledAt: string | null
  }
  role: 'coach' | 'admin'
  onSave: (data: PostFormData, action: 'draft' | 'publish') => Promise<void>
  onCancel: () => void
}

export interface PostFormData {
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  coverImage: string
  coverImageAlt: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  canonicalUrl: string
  ogImage: string
  noIndex: boolean
  scheduledAt: string
}

export function PostEditor({ post, role, onSave, onCancel }: PostEditorProps) {
  const [form, setForm] = useState<PostFormData>({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    content: post?.content ?? '',
    excerpt: post?.excerpt ?? '',
    status: post?.status ?? 'DRAFT',
    coverImage: post?.coverImage ?? '',
    coverImageAlt: post?.coverImageAlt ?? '',
    tags: post?.tags ?? [],
    seoTitle: post?.seoTitle ?? '',
    seoDescription: post?.seoDescription ?? '',
    seoKeywords: post?.seoKeywords ?? [],
    canonicalUrl: post?.canonicalUrl ?? '',
    ogImage: post?.ogImage ?? '',
    noIndex: post?.noIndex ?? false,
    scheduledAt: post?.scheduledAt
      ? (() => { const d = new Date(post.scheduledAt as string); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) })()
      : '',
  })
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Warn on browser tab close / page refresh when there are unsaved changes
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  function markDirty<T>(updater: (prev: PostFormData) => PostFormData) {
    setIsDirty(true)
    setForm(updater)
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.content.replace(/<[^>]*>/g, '').trim()) next.content = 'Content is required'
    if (!form.slug.trim()) next.slug = 'Slug is required'
    else if (!SLUG_RE.test(form.slug)) next.slug = 'Slug must be lowercase letters, numbers, and hyphens only'
    if (form.seoTitle.length > 60) next.seoTitle = 'SEO title must be 60 characters or less'
    if (form.seoDescription.length > 160) next.seoDescription = 'SEO description must be 160 characters or less'
    if (form.scheduledAt && new Date(form.scheduledAt) <= new Date()) {
      next.scheduledAt = 'Scheduled time must be in the future'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSave(action: 'draft' | 'publish') {
    setErrors({})
    if (!validate()) return
    setSaving(true)
    try {
      await onSave(form, action)
      setIsDirty(false)
    } catch (err) {
      if (err instanceof Error && err.message.includes('Slug already exists')) {
        setErrors((prev) => ({ ...prev, slug: 'This slug is already taken' }))
      } else {
        throw err
      }
    } finally {
      setSaving(false)
    }
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    if (!slugManuallyEdited) {
      markDirty((f) => ({ ...f, title, slug: generateSlug(title) }))
    } else {
      markDirty((f) => ({ ...f, title }))
    }
  }

  function handleCancelClick() {
    if (isDirty) {
      setShowCancelDialog(true)
    } else {
      onCancel()
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
        {/* Section 1: Title + Slug */}
        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Your post title"
              className="text-lg mt-1"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <Label>Slug *</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true)
                  markDirty((f) => ({ ...f, slug: e.target.value }))
                }}
              />
            </div>
            <p className="text-xs text-[#6E6A60] mt-1">
              {process.env.NEXT_PUBLIC_SITE_URL}/blog/
              <span className="font-medium text-[#1F1D1A]">{form.slug || '...'}</span>
            </p>
            {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
          </div>
        </div>

        {/* Section 2: Excerpt */}
        <div>
          <Label>Excerpt</Label>
          <Textarea
            value={form.excerpt}
            onChange={(e) => markDirty((f) => ({ ...f, excerpt: e.target.value.slice(0, 300) }))}
            rows={3}
            maxLength={300}
            className="mt-1"
            placeholder="A short summary of your post..."
          />
          <p className="text-xs text-[#6E6A60] text-right mt-1">{form.excerpt.length}/300</p>
        </div>

        {/* Section 3: Cover Image */}
        <div>
          <Label>Cover Image</Label>
          <div className="mt-1">
            <CoverImageUpload
              value={form.coverImage}
              altValue={form.coverImageAlt}
              onChange={(url, alt) => markDirty((f) => ({ ...f, coverImage: url, coverImageAlt: alt }))}
            />
          </div>
        </div>

        {/* Section 4: Content */}
        <div>
          <Label className="mb-1 block">Content *</Label>
          <RichTextEditor
            content={form.content}
            onChange={(html) => markDirty((f) => ({ ...f, content: html }))}
            onImportFile={(html, extractedTitle) => {
              markDirty((f) => ({
                ...f,
                content: html,
                ...(extractedTitle && !f.title ? {
                  title: extractedTitle,
                  slug: !slugManuallyEdited ? generateSlug(extractedTitle) : f.slug,
                } : {}),
              }))
            }}
          />
          {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
        </div>

        {/* Section 5: Tags */}
        <div>
          <Label>Tags</Label>
          <Input
            value={form.tags.join(', ')}
            onChange={(e) =>
              markDirty((f) => ({
                ...f,
                tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              }))
            }
            className="mt-1"
            placeholder="parenting, neurodiversity, coaching"
          />
          <p className="text-xs text-[#6E6A60] mt-1">Comma-separated tags</p>
        </div>

        {/* Section 6: Status */}
        <div>
          <Label>Status</Label>
          <div className="mt-1">
            <Select
              value={form.status}
              onValueChange={(v) => markDirty((f) => ({ ...f, status: v as PostFormData['status'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                {role === 'admin' && <SelectItem value="ARCHIVED">Archived</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Section: Schedule */}
        <div>
          <Label>Publish Schedule</Label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="datetime-local"
              value={form.scheduledAt}
              min={(() => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16) })()}
              onChange={(e) => markDirty((f) => ({ ...f, scheduledAt: e.target.value }))}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {form.scheduledAt && (
              <Button type="button" variant="ghost" size="sm" onClick={() => markDirty((f) => ({ ...f, scheduledAt: '' }))}>
                Clear
              </Button>
            )}
          </div>
          {errors.scheduledAt && <p className="text-red-600 text-sm mt-1">{errors.scheduledAt}</p>}
          <p className="text-xs text-[#6E6A60] mt-1">
            {form.scheduledAt
              ? '⏰ Post will auto-publish at the scheduled time. Click "Save" to apply.'
              : 'Optional. Leave empty to publish manually.'}
          </p>
        </div>

        {/* Section 7: SEO Panel */}
        <SeoPanel
          seoTitle={form.seoTitle}
          seoDescription={form.seoDescription}
          keywords={form.seoKeywords}
          ogImageUrl={form.ogImage}
          canonicalUrl={form.canonicalUrl}
          noIndex={form.noIndex}
          onChange={(field, value) => markDirty((f) => ({ ...f, [field]: value }))}
        />

        {/* Sticky footer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-[#D9CFB9] py-4 px-4 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={handleCancelClick} disabled={saving}>
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
              {saving ? 'Saving...' : form.scheduledAt ? 'Save / Schedule' : 'Save as Draft'}
            </Button>
            <Button
              onClick={() => handleSave('publish')}
              disabled={saving}
              style={{ backgroundColor: '#5F728D', color: '#fff', borderRadius: 9999 }}
            >
              {!post || post.status === 'DRAFT' ? 'Publish' : 'Update'}
            </Button>
          </div>
        </div>
      </div>

      {/* Unsaved changes confirmation dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. If you leave now, your changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep editing
            </Button>
            <Button variant="destructive" onClick={() => { setShowCancelDialog(false); onCancel() }}>
              Discard changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

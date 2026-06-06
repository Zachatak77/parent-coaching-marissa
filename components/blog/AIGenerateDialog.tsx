'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Sparkles, X } from 'lucide-react'

export interface GeneratedPost {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
}

interface AIGenerateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (post: GeneratedPost) => void
}

export function AIGenerateDialog({ open, onOpenChange, onGenerate }: AIGenerateDialogProps) {
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview(null)
    }
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleClose(nextOpen: boolean) {
    if (generating) return
    if (!nextOpen) {
      setText('')
      clearImage()
      setError(null)
    }
    onOpenChange(nextOpen)
  }

  async function handleGenerate() {
    setError(null)
    setGenerating(true)
    try {
      const body = new FormData()
      body.append('text', text)
      if (imageFile) body.append('image', imageFile)

      const res = await fetch('/api/blog/generate', { method: 'POST', body })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? 'Generation failed')
      }
      const result: GeneratedPost = await res.json()
      onGenerate(result)
      handleClose(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate with AI</DialogTitle>
          <DialogDescription>
            Add coaching notes and an image. Gemini will write a full blog post in Marissa&apos;s voice.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>
              Coaching notes / context{' '}
              <span className="font-normal text-[#6E6A60]">(optional)</span>
            </Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="mt-1"
              placeholder="Paste session notes, family scenarios, or any context you want the post to draw from..."
              disabled={generating}
            />
          </div>

          <div>
            <Label>
              Image{' '}
              <span className="font-normal text-[#6E6A60]">(optional)</span>
            </Label>
            <div className="mt-1">
              {imagePreview ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-36 w-auto rounded-md border border-[#D9CFB9] object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    disabled={generating}
                    className="absolute -right-2 -top-2 rounded-full border border-[#D9CFB9] bg-white p-0.5 shadow-sm hover:bg-[#F2EBDA] disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5 text-[#6E6A60]" />
                  </button>
                </div>
              ) : (
                <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-[#D9CFB9] px-4 py-3 text-sm text-[#6E6A60] transition-colors hover:bg-[#F2EBDA]">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={generating}
                  />
                  Choose image
                </label>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={generating}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            style={{ backgroundColor: '#5F728D', color: '#fff', borderRadius: 9999 }}
          >
            {generating ? (
              <>
                <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

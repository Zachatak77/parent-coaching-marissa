'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { CloudUpload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CoverImageUploadProps {
  value: string
  altValue: string
  onChange: (url: string, alt: string) => void
  disabled?: boolean
}

export function CoverImageUpload({ value, altValue, onChange, disabled }: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Fast client-side checks before hitting the network
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Use JPEG, PNG, WebP, or GIF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.')
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 100)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/uploads/blog-image', {
        method: 'POST',
        body: formData,
      })

      clearInterval(interval)

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      const data = await res.json()
      setProgress(100)
      onChange(data.url, altValue)
    } catch {
      clearInterval(interval)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="space-y-2">
          <div className="relative aspect-video max-h-48 overflow-hidden rounded-lg">
            <Image
              src={value}
              alt={altValue || 'Cover image'}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange('', altValue)}
            disabled={disabled}
            className="text-sm text-[#6E6A60] underline"
          >
            Remove
          </button>
          <div className="space-y-1">
            <Label htmlFor="cover-alt">Alt text</Label>
            <Input
              id="cover-alt"
              value={altValue}
              onChange={(e) => onChange(value, e.target.value)}
              placeholder="Describe the image for accessibility"
              disabled={disabled}
            />
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className="cursor-pointer rounded-lg border-2 border-dashed border-[#D9CFB9] bg-[#F7F7F5] p-8 text-center transition-colors hover:bg-[#F2EBDA]"
        >
          <CloudUpload className="mx-auto mb-2 h-8 w-8 text-[#6E6A60]" />
          <p className="text-sm text-[#6E6A60]">Drag &amp; drop an image or click to browse</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-[#6E6A60]">
            JPEG, PNG, WebP, GIF — max 5MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {uploading && (
        <div className="h-1 w-full rounded-full bg-[#E8DED0]">
          <div
            className="h-1 rounded-full bg-[#5F728D] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

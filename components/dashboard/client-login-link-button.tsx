'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Copy, Check, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { generateClientLoginLinkAction } from '@/app/actions/clients'

export function ClientLoginLinkButton({ clientId }: { clientId: string }) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [url, setUrl] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const result = await generateClientLoginLinkAction(clientId)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    setUrl(result.url ?? null)
    setOpen(true)
  }

  const handleCopy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy — copy the link manually')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setUrl(null)
    setCopied(false)
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={handleGenerate} disabled={loading}>
        <Link className="w-3.5 h-3.5 mr-1.5" />
        {loading ? 'Generating…' : 'Get login link'}
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Client login link</DialogTitle>
            <DialogDescription>
              Share this link with your client so they can set their password and log in. It expires after one use.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <Input value={url ?? ''} readOnly className="text-xs font-mono" />
            <Button type="button" size="icon" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

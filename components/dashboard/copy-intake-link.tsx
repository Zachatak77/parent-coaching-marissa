'use client'

import { toast } from 'sonner'

export function CopyIntakeLinkButton() {
  const handleCopy = async () => {
    const url = `${window.location.origin}/portal/intake`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Intake link copied')
    } catch {
      toast.error('Could not copy — please copy the URL manually: ' + url)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-[#1F1D1A] hover:underline mt-1"
    >
      Copy intake link
    </button>
  )
}

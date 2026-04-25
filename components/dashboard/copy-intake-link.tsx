'use client'

export function CopyIntakeLinkButton() {
  const handleCopy = () => {
    const url = `${window.location.origin}/portal/intake`
    navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-[#2D5016] hover:underline mt-1"
    >
      Copy intake link
    </button>
  )
}

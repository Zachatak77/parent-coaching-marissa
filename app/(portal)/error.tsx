'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C8D1DF]/40 mx-auto">
          <AlertCircle className="w-7 h-7 text-[#6E6A60]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1F1D1A]">Something went wrong.</h2>
        <p className="text-sm text-[#6E6A60] leading-relaxed">
          We couldn&apos;t load this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-[#4A5F7F] text-white text-sm font-semibold hover:bg-[#3E5070] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

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
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2D5016]/10 mx-auto">
          <AlertCircle className="w-7 h-7 text-[#2D5016]/60" />
        </div>
        <h2 className="text-lg font-semibold text-[#2D5016]">Something went wrong.</h2>
        <p className="text-sm text-[#2D5016]/55 leading-relaxed">
          We couldn&apos;t load this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-[#2D5016] text-white text-sm font-semibold hover:bg-[#3a6b1e] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

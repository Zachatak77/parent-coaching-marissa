'use client'

import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2D5016]/20 text-sm text-[#2D5016] hover:bg-[#2D5016]/5 transition-colors flex-shrink-0"
    >
      <Printer className="w-4 h-4" />
      Print
    </button>
  )
}

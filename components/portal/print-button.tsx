'use client'

import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D9CFB9] text-sm text-[#1F1D1A] hover:bg-[#3E5070]/5 transition-colors flex-shrink-0"
    >
      <Printer className="w-4 h-4" />
      Print
    </button>
  )
}

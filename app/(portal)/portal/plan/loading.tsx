export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="h-7 w-64 bg-[#C8D1DF]/40 rounded mb-2" />
          <div className="h-4 w-48 bg-[#C8D1DF]/30 rounded" />
        </div>
        <div className="h-9 w-20 bg-[#C8D1DF]/40 rounded-lg" />
      </div>
      <div className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm space-y-3">
        {[1, 0.9, 0.8, 1, 0.7].map((w, i) => (
          <div key={i} className="h-4 bg-[#C8D1DF]/30 rounded" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  )
}

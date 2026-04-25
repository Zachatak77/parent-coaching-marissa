export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="h-7 w-64 bg-[#2D5016]/10 rounded mb-2" />
          <div className="h-4 w-48 bg-[#2D5016]/8 rounded" />
        </div>
        <div className="h-9 w-20 bg-[#2D5016]/10 rounded-lg" />
      </div>
      <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 shadow-sm space-y-3">
        {[1, 0.9, 0.8, 1, 0.7].map((w, i) => (
          <div key={i} className="h-4 bg-[#2D5016]/8 rounded" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  )
}

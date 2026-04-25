export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-44 bg-[#2D5016]/10 rounded mb-2" />
        <div className="h-4 w-64 bg-[#2D5016]/8 rounded" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#2D5016]/10 p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#2D5016]/10 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#2D5016]/10 rounded" />
                <div className="h-3 w-full bg-[#2D5016]/8 rounded" />
              </div>
            </div>
            <div className="h-8 w-24 bg-[#2D5016]/10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

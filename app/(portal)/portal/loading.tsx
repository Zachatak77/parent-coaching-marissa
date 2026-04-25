export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 shadow-sm">
        <div className="h-6 w-48 bg-[#2D5016]/10 rounded mb-2" />
        <div className="h-4 w-72 bg-[#2D5016]/8 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#2D5016]/10 p-5 shadow-sm">
            <div className="h-5 w-5 bg-[#2D5016]/10 rounded mb-3" />
            <div className="h-7 w-10 bg-[#2D5016]/10 rounded mb-1" />
            <div className="h-3 w-24 bg-[#2D5016]/8 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-5 shadow-sm space-y-2">
        <div className="h-4 w-32 bg-[#2D5016]/10 rounded" />
        <div className="h-4 w-full bg-[#2D5016]/8 rounded" />
        <div className="h-4 w-5/6 bg-[#2D5016]/8 rounded" />
      </div>
    </div>
  )
}

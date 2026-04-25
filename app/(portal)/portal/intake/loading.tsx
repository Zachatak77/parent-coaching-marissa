export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-64 bg-[#2D5016]/10 rounded mb-2" />
        <div className="h-4 w-96 bg-[#2D5016]/8 rounded" />
      </div>
      <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 shadow-sm space-y-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-32 bg-[#2D5016]/10 rounded" />
            <div className="h-10 w-full bg-[#2D5016]/8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

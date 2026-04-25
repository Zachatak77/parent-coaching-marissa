export default function Loading() {
  return (
    <div className="space-y-8 max-w-xl animate-pulse">
      <div className="h-7 w-24 bg-[#2D5016]/10 rounded" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 shadow-sm space-y-4">
          <div className="h-4 w-32 bg-[#2D5016]/10 rounded" />
          <div className="h-10 w-full max-w-sm bg-[#2D5016]/8 rounded-lg" />
          <div className="h-9 w-28 bg-[#2D5016]/10 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

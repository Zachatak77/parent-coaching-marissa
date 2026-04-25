export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-[#2D5016]/10 rounded" />
          <div className="h-4 w-36 bg-[#2D5016]/8 rounded" />
        </div>
        <div className="h-9 w-28 bg-[#2D5016]/10 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4 shadow-sm space-y-2">
            <div className="h-3 w-20 bg-muted/70 rounded" />
            <div className="h-5 w-24 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border">
        <div className="flex border-b">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-muted/30 border-r last:border-0" />
          ))}
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted/30 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

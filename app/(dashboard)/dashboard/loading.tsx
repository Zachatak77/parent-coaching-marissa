export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[#2D5016]/10 rounded" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4 shadow-sm space-y-2">
            <div className="h-4 w-4 bg-muted rounded" />
            <div className="h-7 w-12 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted/70 rounded" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-5 shadow-sm space-y-3">
            <div className="h-5 w-32 bg-muted rounded" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-12 bg-muted/50 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

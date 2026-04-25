export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 bg-[#2D5016]/10 rounded" />
        <div className="h-9 w-32 bg-[#2D5016]/10 rounded-lg" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-full bg-muted/70 rounded" />
            <div className="h-3 w-2/3 bg-muted/70 rounded" />
            <div className="flex gap-1.5">
              <div className="h-5 w-14 bg-muted rounded-full" />
              <div className="h-5 w-10 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-24 bg-[#C8D1DF]/40 rounded" />
        <div className="h-9 w-32 bg-[#C8D1DF]/40 rounded-lg" />
      </div>
      <div className="flex gap-3">
        <div className="h-9 flex-1 max-w-sm bg-muted rounded-lg" />
        <div className="h-9 w-40 bg-muted rounded-lg" />
        <div className="h-9 w-48 bg-muted rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="h-10 bg-muted/30 border-b" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0">
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-36 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted/70 rounded" />
            </div>
            <div className="h-4 w-24 bg-muted rounded self-center" />
            <div className="h-5 w-16 bg-muted rounded-full self-center" />
            <div className="h-4 w-20 bg-muted rounded self-center" />
            <div className="h-8 w-16 bg-muted rounded self-center" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-44 bg-[#C8D1DF]/40 rounded mb-2" />
        <div className="h-4 w-64 bg-[#C8D1DF]/30 rounded" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#C8D1DF]/40 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#C8D1DF]/40 rounded" />
                <div className="h-3 w-full bg-[#C8D1DF]/30 rounded" />
              </div>
            </div>
            <div className="h-8 w-24 bg-[#C8D1DF]/40 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

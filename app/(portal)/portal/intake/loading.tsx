export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-64 bg-[#C8D1DF]/40 rounded mb-2" />
        <div className="h-4 w-96 bg-[#C8D1DF]/30 rounded" />
      </div>
      <div className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm space-y-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-32 bg-[#C8D1DF]/40 rounded" />
            <div className="h-10 w-full bg-[#C8D1DF]/30 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm">
        <div className="h-6 w-48 bg-[#C8D1DF]/40 rounded mb-2" />
        <div className="h-4 w-72 bg-[#C8D1DF]/30 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm">
            <div className="h-5 w-5 bg-[#C8D1DF]/40 rounded mb-3" />
            <div className="h-7 w-10 bg-[#C8D1DF]/40 rounded mb-1" />
            <div className="h-3 w-24 bg-[#C8D1DF]/30 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm space-y-2">
        <div className="h-4 w-32 bg-[#C8D1DF]/40 rounded" />
        <div className="h-4 w-full bg-[#C8D1DF]/30 rounded" />
        <div className="h-4 w-5/6 bg-[#C8D1DF]/30 rounded" />
      </div>
    </div>
  )
}

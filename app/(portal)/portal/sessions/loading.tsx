export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-44 bg-[#C8D1DF]/40 rounded mb-2" />
        <div className="h-4 w-72 bg-[#C8D1DF]/30 rounded" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm space-y-3">
          <div className="h-3 w-32 bg-[#C8D1DF]/40 rounded" />
          <div className="h-4 w-full bg-[#C8D1DF]/30 rounded" />
          <div className="h-4 w-5/6 bg-[#C8D1DF]/30 rounded" />
          <div className="h-4 w-3/4 bg-[#C8D1DF]/30 rounded" />
        </div>
      ))}
    </div>
  )
}

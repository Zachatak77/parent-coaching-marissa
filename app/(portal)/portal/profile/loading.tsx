export default function Loading() {
  return (
    <div className="space-y-8 max-w-xl animate-pulse">
      <div className="h-7 w-24 bg-[#C8D1DF]/40 rounded" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm space-y-4">
          <div className="h-4 w-32 bg-[#C8D1DF]/40 rounded" />
          <div className="h-10 w-full max-w-sm bg-[#C8D1DF]/30 rounded-lg" />
          <div className="h-9 w-28 bg-[#C8D1DF]/40 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

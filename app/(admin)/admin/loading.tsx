export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-48 bg-[#D9CFB9] rounded mb-2" />
      <div className="h-4 w-64 bg-[#D9CFB9] rounded mb-8" />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-[#D9CFB9] bg-white p-5">
            <div className="h-3 w-24 bg-[#D9CFB9] rounded mb-4" />
            <div className="h-8 w-12 bg-[#D9CFB9] rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[#D9CFB9] bg-white p-5 mb-6">
        <div className="h-3 w-36 bg-[#D9CFB9] rounded mb-4" />
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-8 w-28 bg-[#D9CFB9] rounded-lg" />)}
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-[#D9CFB9] bg-white p-5">
            <div className="h-3 w-28 bg-[#D9CFB9] rounded mb-4" />
            <div className="h-8 w-12 bg-[#D9CFB9] rounded" />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-[#D9CFB9] bg-white p-5">
            <div className="h-4 w-32 bg-[#D9CFB9] rounded mb-4" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex justify-between mb-3">
                <div className="h-3 w-32 bg-[#D9CFB9] rounded" />
                <div className="h-5 w-14 bg-[#D9CFB9] rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

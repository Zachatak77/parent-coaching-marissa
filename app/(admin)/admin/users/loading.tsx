export default function UsersLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-7 w-36 bg-[#D9CFB9] rounded" />
        <div className="h-8 w-24 bg-[#D9CFB9] rounded-full" />
      </div>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-7 w-20 bg-[#D9CFB9] rounded-full" />)}
      </div>
      <div className="rounded-xl border border-[#D9CFB9] overflow-hidden">
        <div className="h-10 bg-[#F5EFE2] border-b border-[#D9CFB9]" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[#D9CFB9] bg-white">
            <div className="h-4 w-32 bg-[#D9CFB9] rounded" />
            <div className="h-4 w-48 bg-[#D9CFB9] rounded hidden sm:block" />
            <div className="h-5 w-16 bg-[#D9CFB9] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

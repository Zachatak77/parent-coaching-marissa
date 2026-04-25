import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-6xl font-bold text-[#2D5016]/20">404</p>
        <h1 className="text-2xl font-semibold text-[#2D5016]">Page not found.</h1>
        <p className="text-sm text-[#2D5016]/60 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg bg-[#2D5016] text-white text-sm font-semibold hover:bg-[#3a6b1e] transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

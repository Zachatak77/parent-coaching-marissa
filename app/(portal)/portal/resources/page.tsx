import { createClient } from '@/lib/supabase/server'
import { getClientForUser } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { getSignedResourceUrl } from '@/app/actions/portal'
import { Library, FileText, Image, File, ExternalLink, Download } from 'lucide-react'

export const metadata = { title: 'Resources — Parent Portal' }

type Resource = {
  id: string
  title: string
  description: string | null
  tags: string[] | null
  is_public: boolean
  file_url: string | null
  file_type?: string | null
}

function fileIcon(fileUrl: string | null) {
  if (!fileUrl) return File
  const lower = fileUrl.toLowerCase()
  if (lower.includes('.pdf')) return FileText
  if (lower.match(/\.(png|jpg|jpeg|gif|webp|svg)/)) return Image
  return File
}

function isPdf(fileUrl: string | null) {
  return fileUrl?.toLowerCase().includes('.pdf') ?? false
}

export default async function ResourcesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const client = await getClientForUser(supabase, user.id)
  if (!client) redirect('/portal')

  const [{ data: assigned }, { data: publicResources }] = await Promise.all([
    supabase
      .from('client_resources')
      .select('resource_id, resources(id, title, description, tags, is_public, file_url)')
      .eq('client_id', client.id),
    supabase
      .from('resources')
      .select('id, title, description, tags, is_public, file_url')
      .eq('is_public', true),
  ])

  // Merge and deduplicate by resource id
  const seen = new Set<string>()
  const allResources: Resource[] = []

  for (const row of (assigned ?? [])) {
    const r = row.resources as unknown as Resource | null
    if (r && !seen.has(r.id)) { seen.add(r.id); allResources.push(r) }
  }
  for (const r of (publicResources ?? [])) {
    if (!seen.has(r.id)) { seen.add(r.id); allResources.push(r) }
  }

  // Generate signed URLs server-side
  const resourcesWithUrls = await Promise.all(
    allResources.map(async (r) => ({
      ...r,
      signedUrl: r.file_url ? await getSignedResourceUrl(r.file_url) : null,
    }))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1F1D1A]">Your Resources</h1>
        <p className="text-sm text-[#6E6A60] mt-1">Tools, guides, and materials from your coach.</p>
      </div>

      {resourcesWithUrls.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#D9CFB9] p-10 shadow-sm text-center space-y-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C8D1DF]/40 mx-auto">
            <Library className="w-7 h-7 text-[#6E6A60]" />
          </div>
          <p className="text-sm text-[#6E6A60] max-w-sm mx-auto leading-relaxed">
            Your coach will share helpful resources here throughout your program. Check back after your sessions.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {resourcesWithUrls.map((r) => {
            const Icon = fileIcon(r.file_url)
            const pdf = isPdf(r.file_url)
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#C8D1DF]/30 flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#1F1D1A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1F1D1A] leading-tight">{r.title}</p>
                    {r.description && (
                      <p className="text-xs text-[#6E6A60] mt-0.5 line-clamp-2">{r.description}</p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {(r.tags?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags!.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#C8D1DF]/30 text-[#1F1D1A]">
                        {tag}
                      </span>
                    ))}
                    {r.is_public && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                        Public
                      </span>
                    )}
                  </div>
                )}

                {/* Action */}
                {r.signedUrl && (
                  <a
                    href={r.signedUrl}
                    target={pdf ? '_blank' : undefined}
                    rel={pdf ? 'noopener noreferrer' : undefined}
                    download={!pdf}
                    className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-lg bg-[#4A5F7F] text-white text-xs font-semibold hover:bg-[#3E5070] transition-colors"
                  >
                    {pdf ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    {pdf ? 'View' : 'Download'}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

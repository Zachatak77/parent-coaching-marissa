'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, ExternalLink, Trash2, Edit2, Search, Users } from 'lucide-react'
import {
  createResourceAction,
  deleteResourceAction,
  updateResourceAction,
  assignResourceAction,
} from '@/app/actions/resources'

type Resource = {
  id: string
  title: string
  description: string | null
  file_url: string | null
  tags: string[] | null
  is_public: boolean
  created_at: string
}

type Client = {
  id: string
  profiles: { full_name: string | null } | null
}

export function ResourceLibrary({
  resources,
  clients,
}: {
  resources: Resource[]
  clients: Client[]
}) {
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [editResource, setEditResource] = React.useState<Resource | null>(null)
  const [assignResource, setAssignResource] = React.useState<Resource | null>(null)
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState('')
  const [tagFilter, setTagFilter] = React.useState('all')
  const [uploading, setUploading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [assigning, setAssigning] = React.useState<string | null>(null)
  const [clientSearch, setClientSearch] = React.useState('')
  const router = useRouter()

  const allTags = Array.from(new Set(resources.flatMap((r) => r.tags ?? [])))

  const filtered = resources.filter((r) => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase())
    const matchTag = tagFilter === 'all' || (r.tags ?? []).includes(tagFilter)
    return matchSearch && matchTag
  })

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    const fd = new FormData(e.currentTarget)
    const result = await createResourceAction(fd)
    setUploading(false)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Resource uploaded')
      setUploadOpen(false)
      router.refresh()
    }
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editResource) return
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    const tagsRaw = fd.get('tags') as string
    const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []
    const result = await updateResourceAction(editResource.id, {
      title: fd.get('title') as string,
      description: (fd.get('description') as string) || undefined,
      tags,
      is_public: fd.get('is_public') === 'true',
    })
    setSaving(false)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Resource updated')
      setEditResource(null)
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteResourceAction(id)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Resource deleted')
      setDeleteConfirm(null)
      router.refresh()
    }
  }

  const handleAssign = async (resourceId: string, clientId: string) => {
    setAssigning(clientId)
    const result = await assignResourceAction(resourceId, clientId)
    setAssigning(null)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Resource assigned to client')
      setAssignResource(null)
      router.refresh()
    }
  }

  const filteredClients = clients.filter((c) =>
    !clientSearch || (c.profiles?.full_name ?? '').toLowerCase().includes(clientSearch.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative min-w-[200px] max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          {allTags.length > 0 && (
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Button
          size="sm"
          className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white"
          onClick={() => setUploadOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Upload Resource
        </Button>
      </div>

      {/* Resource grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-[#D9CFB9] rounded-lg">
          No resources found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="border border-[#D9CFB9] rounded-lg bg-white p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[#1F1D1A] leading-snug">{r.title}</p>
                <Badge variant={r.is_public ? 'green' : 'gray'} className="text-[10px] flex-shrink-0">
                  {r.is_public ? 'Public' : 'Private'}
                </Badge>
              </div>
              {r.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
              )}
              {(r.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(r.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 pt-1">
                {r.file_url && (
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open
                    </Button>
                  </a>
                )}
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setEditResource(r)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setAssignResource(r)}>
                  <Users className="w-3.5 h-3.5 mr-1" /> Assign
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground hover:text-destructive ml-auto"
                  onClick={() => setDeleteConfirm(r.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Upload New Resource</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="up-title">Title *</Label>
              <Input id="up-title" name="title" required placeholder="Resource title" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="up-desc">Description</Label>
              <Textarea id="up-desc" name="description" rows={2} placeholder="Brief description..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="up-tags">Tags (comma-separated)</Label>
              <Input id="up-tags" name="tags" placeholder="e.g. sleep, behavior" />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="up-public" name="is_public" value="true" />
              <Label htmlFor="up-public">Make public (visible to all parents)</Label>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="up-file">File</Label>
              <Input id="up-file" name="file" type="file" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={uploading} className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white">
                {uploading ? 'Uploading…' : 'Upload'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      {editResource && (
        <Dialog open={!!editResource} onOpenChange={() => setEditResource(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Edit Resource</DialogTitle></DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ed-title">Title *</Label>
                <Input id="ed-title" name="title" defaultValue={editResource.title} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ed-desc">Description</Label>
                <Textarea id="ed-desc" name="description" rows={2} defaultValue={editResource.description ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ed-tags">Tags (comma-separated)</Label>
                <Input id="ed-tags" name="tags" defaultValue={(editResource.tags ?? []).join(', ')} />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="ed-public"
                  name="is_public"
                  value="true"
                  defaultChecked={editResource.is_public}
                />
                <Label htmlFor="ed-public">Make public</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditResource(null)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white">
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign to client dialog */}
      {assignResource && (
        <Dialog open={!!assignResource} onOpenChange={() => setAssignResource(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign &ldquo;{assignResource.title}&rdquo; to Client</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No clients found.</p>
              ) : (
                filteredClients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 p-3 border rounded-md hover:bg-muted/30">
                    <p className="text-sm font-medium">{c.profiles?.full_name ?? '—'}</p>
                    <Button
                      size="sm"
                      className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white"
                      disabled={assigning === c.id}
                      onClick={() => handleAssign(assignResource.id, c.id)}
                    >
                      {assigning === c.id ? '…' : 'Assign'}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Resource</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will permanently delete the resource and remove it from all client assignments. This cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

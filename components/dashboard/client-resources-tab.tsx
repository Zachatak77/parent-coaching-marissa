'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, ExternalLink, Trash2, Search } from 'lucide-react'
import { assignResourceAction, removeClientResourceAction, createResourceAction } from '@/app/actions/resources'

type ClientResource = {
  id: string
  resource_id: string
  resources: {
    id: string
    title: string
    description: string | null
    file_url: string | null
    tags: string[] | null
    is_public: boolean
  }
}

type Resource = {
  id: string
  title: string
  description: string | null
  file_url: string | null
  tags: string[] | null
  is_public: boolean
}

export function ClientResourcesTab({
  clientId,
  assignments,
  allResources,
}: {
  clientId: string
  assignments: ClientResource[]
  allResources: Resource[]
}) {
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const [assigning, setAssigning] = React.useState<string | null>(null)
  const router = useRouter()

  const alreadyAssigned = new Set(assignments.map((a) => a.resource_id))
  const filteredResources = allResources.filter(
    (r) =>
      !alreadyAssigned.has(r.id) &&
      (!search || r.title.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAssign = async (resourceId: string) => {
    setAssigning(resourceId)
    const result = await assignResourceAction(resourceId, clientId)
    setAssigning(null)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Resource assigned')
      router.refresh()
      setAssignOpen(false)
    }
  }

  const handleRemove = async (assignmentId: string) => {
    const result = await removeClientResourceAction(assignmentId, clientId)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Resource removed')
      router.refresh()
    }
  }

  const handleUploadAndAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    const fd = new FormData(e.currentTarget)
    fd.set('is_public', 'false')
    const result = await createResourceAction(fd)
    if (result.error) {
      setUploading(false)
      toast.error(result.error)
      return
    }
    if (result.resourceId) {
      const assignResult = await assignResourceAction(result.resourceId, clientId)
      if (assignResult.error) {
        setUploading(false)
        toast.error('Uploaded but failed to assign: ' + assignResult.error)
        return
      }
    }
    setUploading(false)
    toast.success('Resource uploaded and assigned')
    setUploadOpen(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Upload Resource
        </Button>
        <Button
          size="sm"
          className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white"
          onClick={() => setAssignOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Assign Resource
        </Button>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-[#2D5016]/20 rounded-lg">
          No resources assigned yet.
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-4 p-4 border border-[#2D5016]/15 rounded-lg bg-white">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#2D5016]">{a.resources.title}</p>
                {a.resources.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.resources.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.resources.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {a.resources.file_url && (
                  <a href={a.resources.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4" /></Button>
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(a.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign resource dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Resource</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredResources.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {allResources.length === 0 ? 'No resources in library yet.' : 'All resources already assigned.'}
              </p>
            ) : (
              filteredResources.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-3 border rounded-md hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    {r.description && <p className="text-xs text-muted-foreground truncate">{r.description}</p>}
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white flex-shrink-0"
                    disabled={assigning === r.id}
                    onClick={() => handleAssign(r.id)}
                  >
                    {assigning === r.id ? '…' : 'Assign'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload resource dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadAndAssign} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="res-title">Title *</Label>
              <Input id="res-title" name="title" required placeholder="Resource title" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-desc">Description</Label>
              <Textarea id="res-desc" name="description" rows={2} placeholder="Brief description..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-tags">Tags (comma-separated)</Label>
              <Input id="res-tags" name="tags" placeholder="e.g. sleep, behavior, communication" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-file">File</Label>
              <Input id="res-file" name="file" type="file" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={uploading} className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white">
                {uploading ? 'Uploading…' : 'Upload & Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

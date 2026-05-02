'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import { savePlanAction, togglePlanPublishAction } from '@/app/actions/coaching-plans'

type Objective = {
  objective: string
  actionSteps: string
  timeline: string
  successIndicators: string
}

type Plan = {
  id: string
  title: string
  content: { body?: string; objectives?: Objective[] } | null
  is_published: boolean
  updated_at: string
}

export function CoachingPlanEditor({ clientId, plan }: { clientId: string; plan: Plan | null }) {
  const [title, setTitle] = React.useState(plan?.title ?? '')
  const [body, setBody] = React.useState(plan?.content?.body ?? '')
  const [objectives, setObjectives] = React.useState<Objective[]>(
    plan?.content?.objectives ?? [{ objective: '', actionSteps: '', timeline: '', successIndicators: '' }]
  )
  const [saving, setSaving] = React.useState(false)
  const [isPublished, setIsPublished] = React.useState(plan?.is_published ?? false)

  const save = async (publish: boolean) => {
    setSaving(true)
    const result = await savePlanAction(clientId, {
      planId: plan?.id,
      title,
      content: body,
      objectives,
      publish,
    })
    setSaving(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      setIsPublished(publish)
      toast.success(publish ? 'Plan published to parent' : 'Draft saved')
    }
  }

  const handleTogglePublish = async () => {
    if (!plan?.id) return
    setSaving(true)
    const result = await togglePlanPublishAction(plan.id, clientId, !isPublished)
    setSaving(false)
    if (result.error) toast.error(result.error)
    else {
      setIsPublished(!isPublished)
      toast.success(!isPublished ? 'Plan published to parent' : 'Plan unpublished')
    }
  }

  const addObjective = () =>
    setObjectives([...objectives, { objective: '', actionSteps: '', timeline: '', successIndicators: '' }])

  const removeObjective = (i: number) => setObjectives(objectives.filter((_, idx) => idx !== i))

  const updateObjective = (i: number, field: keyof Objective, value: string) => {
    const updated = [...objectives]
    updated[i] = { ...updated[i], [field]: value }
    setObjectives(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isPublished && <Badge variant="green">Published</Badge>}
          {plan?.updated_at && (
            <span className="text-xs text-muted-foreground">
              Last updated {new Date(plan.updated_at).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {plan?.id && (
            <Button variant="outline" size="sm" onClick={handleTogglePublish} disabled={saving}>
              {isPublished ? 'Unpublish' : 'Publish to Parent'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => save(false)} disabled={saving}>
            {saving ? 'Saving…' : 'Save Draft'}
          </Button>
          <Button
            size="sm"
            className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white"
            onClick={() => save(true)}
            disabled={saving}
          >
            Publish to Parent
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Plan Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Coaching Plan Title" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Plan Body</label>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe the coaching plan, goals, and approach..."
          rows={8}
          className="resize-none font-mono text-sm"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Key Objectives</h3>
          <Button variant="outline" size="sm" onClick={addObjective}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Row
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-md overflow-hidden">
            <thead className="bg-muted/50">
              <tr>
                {['Objective', 'Action Steps', 'Timeline', 'Success Indicators', ''].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {objectives.map((obj, i) => (
                <tr key={i} className="border-t border-border">
                  {(['objective', 'actionSteps', 'timeline', 'successIndicators'] as const).map((field) => (
                    <td key={field} className="px-2 py-1">
                      <input
                        className="w-full bg-transparent outline-none text-sm px-1 py-0.5 focus:bg-muted/30 rounded min-w-[100px]"
                        value={obj[field]}
                        onChange={(e) => updateObjective(i, field, e.target.value)}
                        placeholder={field === 'objective' ? 'Enter objective…' : '…'}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1">
                    <button
                      onClick={() => removeObjective(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

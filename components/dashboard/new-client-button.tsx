'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClientAction } from '@/app/actions/clients'

const schema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email required'),
  package: z.enum(['confident_parent', 'partnership', 'ongoing']),
  start_date: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface NewClientButtonProps {
  coachId: string
  prefill?: { name?: string; email?: string }
  onSuccess?: (clientId: string) => void
  triggerLabel?: string
}

export function NewClientButton({ coachId, prefill, onSuccess, triggerLabel }: NewClientButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [loginLink, setLoginLink] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)
  const router = useRouter()

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: prefill?.name ?? '',
      email: prefill?.email ?? '',
      package: 'confident_parent',
    },
  })

  React.useEffect(() => {
    if (open && prefill) {
      setValue('full_name', prefill.name ?? '')
      setValue('email', prefill.email ?? '')
    }
  }, [open, prefill, setValue])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    const fd = new FormData()
    fd.append('full_name', values.full_name)
    fd.append('email', values.email)
    fd.append('package', values.package)
    if (values.start_date) fd.append('start_date', values.start_date)
    if (values.notes) fd.append('notes', values.notes)

    const result = await createClientAction(fd)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    reset()
    if (onSuccess && result.clientId) onSuccess(result.clientId)
    router.refresh()

    if (result.setPasswordUrl) {
      setLoginLink(result.setPasswordUrl)
    } else {
      toast.success('Client created.')
      setOpen(false)
    }
  }

  const handleCopy = async () => {
    if (!loginLink) return
    try {
      await navigator.clipboard.writeText(loginLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy — please copy the link manually')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setLoginLink(null)
    setCopied(false)
  }

  return (
    <>
      <Button
        size="sm"
        className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white"
        onClick={() => setOpen(true)}
      >
        <Plus className="w-4 h-4 mr-1.5" />
        {triggerLabel ?? 'New Client'}
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          {loginLink ? (
            <>
              <DialogHeader>
                <DialogTitle>Client created</DialogTitle>
                <DialogDescription>
                  Share this link with your client so they can set their password and log in. It expires after one use.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 mt-2">
                <Input value={loginLink} readOnly className="text-xs font-mono" />
                <Button type="button" size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <DialogFooter className="pt-2">
                <Button className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white" onClick={handleClose}>
                  Done
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Create a client account. You&apos;ll get a login link to share with them directly.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input id="full_name" {...register('full_name')} placeholder="Jane Smith" />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="jane@example.com" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Package *</Label>
                  <Select
                    defaultValue="confident_parent"
                    onValueChange={(val) => setValue('package', val as FormValues['package'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confident_parent">Confident Parent Program</SelectItem>
                      <SelectItem value="partnership">Parent Coaching Partnership</SelectItem>
                      <SelectItem value="ongoing">Ongoing Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" type="date" {...register('start_date')} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" {...register('notes')} placeholder="Any initial notes..." rows={2} />
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Client'}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

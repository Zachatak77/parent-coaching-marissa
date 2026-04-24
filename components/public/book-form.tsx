'use client'

import * as React from 'react'
import Script from 'next/script'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { submitDiscoveryCall } from '@/app/actions/book'
import { CheckCircle2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('A valid email is required'),
  phone: z.string().optional(),
  child_ages: z.string().min(1, 'Please share your child\'s age(s)'),
  main_concern: z.string().min(10, 'Please share a bit more — even a sentence helps'),
  how_they_heard: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function BookForm() {
  const [submitted, setSubmitted] = React.useState(false)
  const [submittedName, setSubmittedName] = React.useState('')
  const [serverError, setServerError] = React.useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => { if (v) fd.append(k, v) })
    const result = await submitDiscoveryCall(fd)
    if (result.error) {
      setServerError(result.error)
      return
    }
    setSubmittedName(values.name.split(' ')[0])
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-[#2D5016]" />
          </div>
          <h2 className="font-nunito text-2xl font-extrabold text-[#2D5016] mb-2">
            Thanks, {submittedName}!
          </h2>
          <p className="text-[#2D5016]/70">
            Now pick a time that works for you.
          </p>
        </div>

        {calendlyUrl ? (
          <>
            <div
              className="calendly-inline-widget w-full rounded-xl overflow-hidden"
              data-url={calendlyUrl}
              style={{ minWidth: '320px', height: '630px' }}
            />
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="lazyOnload"
            />
          </>
        ) : (
          <div className="text-center p-8 bg-[#2D5016]/5 rounded-xl border border-[#2D5016]/15">
            <p className="text-sm text-[#2D5016]/70 mb-3">
              Scheduling coming soon. In the meantime, reach out directly:
            </p>
            <a
              href="mailto:parentcoachwithmarissa@gmail.com"
              className="text-sm font-semibold text-[#2D5016] hover:underline"
            >
              parentcoachwithmarissa@gmail.com
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{serverError}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" {...register('name')} placeholder="Jane Smith" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} placeholder="jane@example.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number <span className="text-muted-foreground">(optional)</span></Label>
          <Input id="phone" type="tel" {...register('phone')} placeholder="(555) 000-0000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="child_ages">Child&apos;s Age(s) *</Label>
          <Input id="child_ages" {...register('child_ages')} placeholder='e.g. "4 and 7"' />
          {errors.child_ages && <p className="text-xs text-destructive">{errors.child_ages.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="main_concern">What&apos;s the main challenge you&apos;re facing right now? *</Label>
        <Textarea
          id="main_concern"
          {...register('main_concern')}
          placeholder="Tell me a little about what's going on at home..."
          rows={4}
          className="resize-none"
        />
        {errors.main_concern && <p className="text-xs text-destructive">{errors.main_concern.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>How did you hear about Marissa?</Label>
        <Select onValueChange={(v) => setValue('how_they_heard', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select one..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Google">Google</SelectItem>
            <SelectItem value="Friend/Family referral">Friend / Family referral</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-lg bg-[#2D5016] text-[#F5F0E8] font-bold px-6 py-4 text-base hover:bg-[#3a6b1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending…' : 'Send My Request'}
      </button>
    </form>
  )
}

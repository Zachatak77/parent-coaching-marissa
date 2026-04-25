'use client'

import * as React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { submitIntakeAction } from '@/app/actions/portal'
import Link from 'next/link'

const IntakeSchema = z.object({
  parent_name: z.string().min(1, 'Name is required'),
  children: z.array(z.object({
    name: z.string().min(1, 'Child name required'),
    age: z.string().min(1, 'Age required'),
  })).min(1, 'Add at least one child'),
  family_structure: z.string().min(1, 'Please select'),
  main_challenge: z.string().min(5, 'Please describe your challenge'),
  how_long: z.string().min(1, 'Please select'),
  strategies_tried: z.string().optional(),
  success_looks_like: z.string().min(5, 'Please describe what success looks like'),
  child_temperament: z.string().optional(),
  diagnoses: z.string().optional(),
  responds_well: z.string().optional(),
  escalates: z.string().optional(),
  parenting_approach: z.string().optional(),
  strengths: z.string().optional(),
  needs_support: z.string().optional(),
  contact_method: z.string().min(1, 'Please select'),
  best_time: z.string().min(1, 'Please select'),
  anything_else: z.string().optional(),
})

type IntakeValues = z.infer<typeof IntakeSchema>

interface IntakeFormProps {
  clientId: string
  firstName: string
  defaultName: string
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-[#2D5016] border-b border-[#2D5016]/10 pb-3">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, required, children, error }: {
  label: string; required?: boolean; children: React.ReactNode; error?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-[#2D5016]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function IntakeForm({ clientId, firstName, defaultName }: IntakeFormProps) {
  const [done, setDone] = React.useState(false)

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<IntakeValues>({
      resolver: zodResolver(IntakeSchema),
      defaultValues: {
        parent_name: defaultName,
        children: [{ name: '', age: '' }],
        family_structure: '',
        how_long: '',
        contact_method: '',
        best_time: '',
      },
    })

  const { fields, append, remove } = useFieldArray({ control, name: 'children' })

  async function onSubmit(values: IntakeValues) {
    const result = await submitIntakeAction(clientId, values as Record<string, unknown>)
    if (result.error) {
      toast.error(result.error)
      return
    }
    setDone(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-10 shadow-sm text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#2D5016]/10 mx-auto">
          <CheckCircle2 className="w-8 h-8 text-[#2D5016]" />
        </div>
        <h2 className="text-xl font-semibold text-[#2D5016]">Thank you, {firstName}!</h2>
        <p className="text-sm text-[#2D5016]/65 max-w-sm mx-auto leading-relaxed">
          Your coach will review this before your first session. You&rsquo;re one step closer to a calmer, more connected home.
        </p>
        <Link
          href="/portal"
          className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-lg bg-[#2D5016] text-white text-sm font-semibold hover:bg-[#3a6b1e] transition-colors"
        >
          Go to My Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1 */}
      <Section title="Section 1: About Your Family">
        <Field label="Parent name(s)" required error={errors.parent_name?.message}>
          <Input {...register('parent_name')} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>

        <div>
          <Label className="text-sm text-[#2D5016] mb-2 block">
            Children&rsquo;s names and ages<span className="text-red-500 ml-0.5">*</span>
          </Label>
          <div className="space-y-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`children.${i}.name`)}
                  placeholder="Name"
                  className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]"
                />
                <Input
                  {...register(`children.${i}.age`)}
                  placeholder="Age"
                  className="border-[#2D5016]/25 focus-visible:ring-[#2D5016] w-20 flex-shrink-0"
                />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(i)}
                    className="p-2 text-red-400 hover:text-red-600 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => append({ name: '', age: '' })}
            className="mt-2 flex items-center gap-1.5 text-xs text-[#2D5016] font-medium hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add another child
          </button>
          {errors.children && <p className="text-xs text-red-500 mt-1">{errors.children.message ?? errors.children.root?.message}</p>}
        </div>

        <Field label="Family structure" required error={errors.family_structure?.message}>
          <Select onValueChange={(v) => setValue('family_structure', v)}>
            <SelectTrigger className="border-[#2D5016]/25 focus:ring-[#2D5016]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {['Two-parent household', 'Single parent', 'Co-parenting', 'Other'].map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      {/* Section 2 */}
      <Section title="Section 2: What Brings You Here">
        <Field label="What is the main challenge you're facing right now?" required error={errors.main_challenge?.message}>
          <Textarea {...register('main_challenge')} rows={3} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
        <Field label="How long has this been a concern?" required error={errors.how_long?.message}>
          <Select onValueChange={(v) => setValue('how_long', v)}>
            <SelectTrigger className="border-[#2D5016]/25 focus:ring-[#2D5016]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {['Less than a month', '1–3 months', '3–6 months', 'Over 6 months'].map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Have you tried any strategies so far? If so, what?" error={errors.strategies_tried?.message}>
          <Textarea {...register('strategies_tried')} rows={2} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
        <Field label="What does success look like for your family?" required error={errors.success_looks_like?.message}>
          <Textarea {...register('success_looks_like')} rows={3} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
      </Section>

      {/* Section 3 */}
      <Section title="Section 3: Your Child">
        <Field label="What words would you use to describe your child's temperament?" error={errors.child_temperament?.message}>
          <Textarea {...register('child_temperament')} rows={2} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
        <Field label="Are there any diagnoses or evaluations we should be aware of? (optional)" error={errors.diagnoses?.message}>
          <Textarea {...register('diagnoses')} rows={2} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
        <Field label="What does your child respond well to?" error={errors.responds_well?.message}>
          <Textarea {...register('responds_well')} rows={2} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
        <Field label="What tends to escalate situations?" error={errors.escalates?.message}>
          <Textarea {...register('escalates')} rows={2} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
      </Section>

      {/* Section 4 */}
      <Section title="Section 4: Your Parenting Style">
        <Field label="How would you describe your current parenting approach?" error={errors.parenting_approach?.message}>
          <Textarea {...register('parenting_approach')} rows={2} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
        <Field label="What are your biggest strengths as a parent?" error={errors.strengths?.message}>
          <Textarea {...register('strengths')} rows={2} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
        <Field label="Where do you feel you need the most support?" error={errors.needs_support?.message}>
          <Textarea {...register('needs_support')} rows={2} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
      </Section>

      {/* Section 5 */}
      <Section title="Section 5: Logistics">
        <Field label="Preferred contact method" required error={errors.contact_method?.message}>
          <Select onValueChange={(v) => setValue('contact_method', v)}>
            <SelectTrigger className="border-[#2D5016]/25 focus:ring-[#2D5016]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {['Email', 'Text', 'Either'].map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Best time to reach you" required error={errors.best_time?.message}>
          <Select onValueChange={(v) => setValue('best_time', v)}>
            <SelectTrigger className="border-[#2D5016]/25 focus:ring-[#2D5016]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {['Morning', 'Afternoon', 'Evening'].map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Anything else you'd like your coach to know? (optional)" error={errors.anything_else?.message}>
          <Textarea {...register('anything_else')} rows={3} className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]" />
        </Field>
      </Section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-lg bg-[#2D5016] text-white font-semibold text-sm hover:bg-[#3a6b1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Intake Form'}
      </button>
    </form>
  )
}

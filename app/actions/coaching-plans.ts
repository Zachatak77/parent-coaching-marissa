'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getResend, FROM } from '@/lib/email/resend'
import { render } from '@react-email/render'
import { PlanPublished } from '@/lib/email/templates/plan-published'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://parentcoaching.vercel.app'

async function sendPlanPublishedEmail(supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never, clientId: string, planTitle: string) {
  try {
    const { data: client } = await supabase
      .from('clients')
      .select('profiles(full_name, email)')
      .eq('id', clientId)
      .single()

    const profile = client?.profiles as unknown as { full_name: string | null; email: string | null } | null
    if (!profile?.email) return

    const html = await render(PlanPublished({
      clientName: profile.full_name ?? 'there',
      planTitle,
      portalUrl: `${SITE_URL}/portal/plan`,
    }))
    await getResend().emails.send({
      from: FROM,
      to: profile.email,
      subject: 'Your coaching plan is ready — Parent Coaching with Marissa',
      html,
    })
  } catch {
    // Non-fatal
  }
}

export async function savePlanAction(
  clientId: string,
  data: {
    planId?: string
    title: string
    content: string
    objectives: Array<{ objective: string; actionSteps: string; timeline: string; successIndicators: string }>
    publish: boolean
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const planContent = {
    body: data.content,
    objectives: data.objectives,
  }

  let wasAlreadyPublished = false

  if (data.planId) {
    const { data: existing } = await supabase
      .from('coaching_plans')
      .select('is_published')
      .eq('id', data.planId)
      .single()
    wasAlreadyPublished = existing?.is_published ?? false

    const { error } = await supabase
      .from('coaching_plans')
      .update({
        title: data.title,
        content: planContent,
        is_published: data.publish,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.planId)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('coaching_plans').insert({
      client_id: clientId,
      coach_id: user.id,
      title: data.title,
      content: planContent,
      is_published: data.publish,
    })
    if (error) return { error: error.message }
  }

  // Email parent only when newly publishing (not on every save)
  if (data.publish && !wasAlreadyPublished) {
    await sendPlanPublishedEmail(supabase, clientId, data.title)
  }

  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

export async function togglePlanPublishAction(planId: string, clientId: string, publish: boolean) {
  const supabase = await createClient()

  if (publish) {
    const { data: existing } = await supabase
      .from('coaching_plans')
      .select('is_published, title')
      .eq('id', planId)
      .single()
    const wasAlreadyPublished = existing?.is_published ?? false

    const { error } = await supabase
      .from('coaching_plans')
      .update({ is_published: true, updated_at: new Date().toISOString() })
      .eq('id', planId)
    if (error) return { error: error.message }

    if (!wasAlreadyPublished && existing?.title) {
      await sendPlanPublishedEmail(supabase, clientId, existing.title)
    }
  } else {
    const { error } = await supabase
      .from('coaching_plans')
      .update({ is_published: false, updated_at: new Date().toISOString() })
      .eq('id', planId)
    if (error) return { error: error.message }
  }

  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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

  if (data.planId) {
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

  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

export async function togglePlanPublishAction(planId: string, clientId: string, publish: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('coaching_plans')
    .update({ is_published: publish, updated_at: new Date().toISOString() })
    .eq('id', planId)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

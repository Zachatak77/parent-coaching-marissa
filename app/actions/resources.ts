'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ResourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tags: z.string().optional(),
  is_public: z.boolean().optional(),
})

export async function createResourceAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : []

  const raw = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
    tags: tagsRaw || undefined,
    is_public: formData.get('is_public') === 'true',
  }

  const parsed = ResourceSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const file = formData.get('file') as File | null
  let file_url: string | null = null

  if (file && file.size > 0) {
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filename, file, { upsert: false })
    if (uploadError) return { error: uploadError.message }

    const { data: urlData } = supabase.storage.from('resources').getPublicUrl(uploadData.path)
    file_url = urlData.publicUrl
  }

  const { data: resource, error } = await supabase.from('resources').insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    tags,
    is_public: parsed.data.is_public ?? false,
    file_url,
    created_by: user.id,
  }).select('id').single()

  if (error) return { error: error.message }
  revalidatePath('/dashboard/resources')
  return { success: true, resourceId: resource.id }
}

export async function updateResourceAction(
  resourceId: string,
  data: { title?: string; description?: string; tags?: string[]; is_public?: boolean }
) {
  const supabase = await createClient()
  const { error } = await supabase.from('resources').update(data).eq('id', resourceId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/resources')
  return { success: true }
}

export async function deleteResourceAction(resourceId: string) {
  const supabase = await createClient()

  // Fetch file path before deleting the row
  const { data: resource } = await supabase
    .from('resources')
    .select('file_url')
    .eq('id', resourceId)
    .single()

  await supabase.from('client_resources').delete().eq('resource_id', resourceId)

  const { error } = await supabase.from('resources').delete().eq('id', resourceId)
  if (error) return { error: error.message }

  // Clean up storage file after DB row is gone
  if (resource?.file_url) {
    const match = resource.file_url.match(/\/storage\/v1\/object\/(?:public\/)?resources\/(.+)/)
    if (match) {
      await supabase.storage.from('resources').remove([match[1]])
    }
  }

  revalidatePath('/dashboard/resources')
  return { success: true }
}

export async function assignResourceAction(resourceId: string, clientId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('client_resources').insert({
    resource_id: resourceId,
    client_id: clientId,
    assigned_by: user.id,
  })
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

export async function removeClientResourceAction(assignmentId: string, clientId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('client_resources').delete().eq('id', assignmentId)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/api-helpers'

const SYSTEM_PROMPT = `You are writing a blog post for Reimagine Parenting (reimagineparenting.co),
a parent coaching business run by Marissa Schattner — a special education
teacher specializing in neurodiverse children ages 3–12.

---

## STEP 1 — READ THE IMAGE

Carefully analyze the uploaded image: its visual elements, mood, colors,
subjects, setting, and emotional tone. Identify one central theme or feeling
it evokes. That theme becomes the emotional anchor for the entire post.

---

## STEP 2 — ANONYMIZE SOURCE MATERIAL (if provided)

If any coaching notes, session summaries, family scenarios, or case
examples are included in this prompt, apply the following before writing:

- Remove all names — replace with neutral references: "one parent I worked
  with," "a child I know," "a family I've supported"
- Remove ages if they are specific enough to be identifying — round to
  a range ("a 5-year-old" becomes "a kindergartner" or "a child around
  that age")
- Remove school names, therapist names, locations, diagnoses if rare or
  highly specific
- Remove any detail — even seemingly small ones like a sibling's name or
  a pet — that could identify the family in combination with other details
- If a scenario is too specific to generalize safely, abstract it into a
  universal pattern: "This is something I see often with kids who..."
  rather than describing the specific incident

The family's story can inspire the post. It should never be traceable
back to them — not even by the family themselves.

---

## STEP 3 — CHOOSE A POST FORMAT

Before writing, randomly select ONE of the following structures. Do not
default to the same structure across posts. Vary your selection each time:

- **Narrative-led**: Opens with a scene or story, builds to insight, ends
  with a reframe
- **Question-led**: Opens with a provocative or validating question the
  reader has already asked themselves
- **Myth-busting**: Opens by naming a common belief parents hold, then
  gently dismantles it
- **List-within-story**: Conversational narrative that contains a natural
  mid-post list of 3–5 practical insights
- **Letter format**: Written as a direct, intimate letter to the parent
  reading it
- **Before/After reframe**: Contrasts how a moment feels in the thick of it
  vs. what it actually means

---

## STEP 4 — WRITE THE POST

Write in Marissa's voice — warm, grounded, and deeply empathetic.

**Voice rules:**
- Validate the parent's experience *before* offering any guidance
- Speak directly: "You've been there." "You already know this feeling."
- Mix short punchy sentences with longer explanatory ones — vary the rhythm
  within every paragraph, not just across them
- Evidence-based but never clinical; immediately follow any technical term
  with a plain-English translation in the same sentence
- First person as Marissa throughout
- Never use the words: *transformative, navigate, empower, journey,
  thrive, unlock, foster* — these read as AI-generated
- Avoid hollow transitions: never open a paragraph with "It's important
  to note," "In today's world," "As parents," or "Remember that"
- Do not number the takeaways or bullet every insight — let ideas breathe
  in prose when the format calls for it
- The post should feel like it was written on a Tuesday afternoon, not
  optimized for a content calendar

**Length:** 400–600 words. Tight. No filler.

**Closing:** End with one honest, low-pressure sentence that acknowledges
parent coaching exists — but only if it resonates. Never pitch. Never use
a call-to-action formula.

---

## STEP 5 — SELF-CHECK BEFORE OUTPUT

Before returning the post, silently ask:
- Does the opening hook feel human, not like a blog intro template?
- Is there at least one moment a parent would stop and think "that's exactly it"?
- Could this have been written by a real person, not assembled by an AI?
- Is the structure different from a standard intro → body → conclusion format?
- Has all identifying information been removed from any source material provided?

If any answer is no, revise before outputting.

Return your response using EXACTLY this format with these delimiter tags:

===TITLE===
Your title here
===SLUG===
your-slug-here
===EXCERPT===
Your excerpt here
===CONTENT===
Full blog post content here
===TAGS===
tag1, tag2, tag3`

export async function POST(request: NextRequest) {
  const { error } = await requireRole('coach')
  if (error) return error

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  const text = formData.get('text') as string | null
  const imageFile = formData.get('image') as File | null

  const parts: unknown[] = []

  if (imageFile && imageFile.size > 0) {
    const buffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    parts.push({
      inlineData: {
        mimeType: imageFile.type || 'image/jpeg',
        data: base64,
      },
    })
  }

  let fullPrompt = SYSTEM_PROMPT
  if (text?.trim()) {
    fullPrompt += `\n\n---\n\nCoaching notes / context provided by Marissa:\n\n${text.trim()}`
  }
  parts.push({ text: fullPrompt })

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
    }
  )

  if (!geminiRes.ok) {
    const errBody = await geminiRes.json().catch(() => ({}))
    const msg = (errBody as { error?: { message?: string } }).error?.message ?? 'Gemini request failed'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  const data = await geminiRes.json()
  const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Parse the delimited response (mirrors the n8n parsing logic)
  const rawParts = raw.split(/===([A-Z]+)===/)
  const sections: Record<string, string> = {}
  for (let i = 1; i < rawParts.length; i += 2) {
    sections[rawParts[i]] = rawParts[i + 1]?.trim() ?? ''
  }

  return NextResponse.json({
    title: sections.TITLE ?? '',
    slug: sections.SLUG ?? '',
    excerpt: sections.EXCERPT ?? '',
    content: sections.CONTENT ?? '',
    tags: (sections.TAGS ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
  })
}

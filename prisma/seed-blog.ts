/**
 * Blog seed — Prisma v7 requires a driver adapter for PrismaClient.
 *
 * To run locally, install the pg adapter first:
 *   npm install @prisma/adapter-pg pg @types/pg
 *
 * Then replace the prisma instantiation below with:
 *   import { PrismaPg } from '@prisma/adapter-pg'
 *   import { Pool } from 'pg'
 *   const pool = new Pool({ connectionString: process.env.DIRECT_URL })
 *   const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
 *
 * Alternatively, run the SQL equivalent directly in Supabase SQL Editor.
 */
import { PrismaClient, PostStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })
config({ path: resolve(__dirname, '../.env') })

const pool = new Pool({ connectionString: process.env.DIRECT_URL })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) as any })

async function main() {
  // Seed requires at least one profile to exist as author.
  // Uses the first coach or admin profile found.
  const author = await prisma.user.findFirst({
    where: { OR: [{ email: { contains: 'marissa' } }] },
  })

  if (!author) {
    console.error(
      '❌ No author found. Log in once to create your profile, then re-run this seed.'
    )
    process.exit(1)
  }

  console.log(`✅ Seeding blog posts as ${author.email ?? author.id}`)

  await prisma.blogPost.createMany({
    skipDuplicates: true,
    data: [
      // 1 — PUBLISHED, full SEO fields
      {
        title: 'Why "Just Listen" Is the Most Powerful Thing You Can Do for Your Child',
        slug: 'why-just-listen-is-powerful-for-your-child',
        content: `When parents come to me feeling overwhelmed, the first thing I ask is: "When did you last sit with your child for five minutes and simply listen—no problem-solving, no redirecting, no phone in your hand?"

Most parents pause. Some look embarrassed. Not because they don't love their children, but because modern parenting culture has convinced us that our job is to *fix* things. We feel useful when we explain, correct, and guide. Listening—just listening—can feel passive, even lazy.

It isn't.

**What happens in the brain when a child feels heard**

Neuroscience tells us that children, particularly those with sensory or emotional regulation challenges, experience the world at a higher emotional pitch than neurotypical adults. When a caregiver listens without judgment, the child's nervous system receives a co-regulation signal: *You are safe. I am here. This feeling will pass.*

This is not a soft skill. It is a biological intervention.

**The three levels of listening**

Most of us listen at Level 1—we hear the words and formulate our response. Level 2 is listening for emotion: *what is my child actually feeling right now?* Level 3 is listening for the need beneath the feeling: *what does my child need that they cannot yet name?*

Coaching parents to move from Level 1 to Level 3 consistently is one of the most transformative shifts I see in family dynamics.

**A practice to try this week**

Set a 5-minute timer. Sit with your child. Ask one open question: "What was the hardest part of your day?" Then listen. Resist the urge to respond with anything except "Tell me more."

Notice what changes.`,
        excerpt:
          'The science behind why listening—really listening—rewires the parent-child relationship and calms an overwhelmed nervous system.',
        status: PostStatus.PUBLISHED,
        authorId: author.id,
        coverImage: null,
        coverImageAlt: null,
        tags: ['connection', 'neurodiversity', 'emotional regulation', 'active listening'],
        publishedAt: new Date('2026-04-10T10:00:00Z'),
        seoTitle: 'Why Listening Is the Most Powerful Parenting Tool',
        seoDescription:
          'Discover the neuroscience behind why truly listening to your child is the most effective parenting intervention—and how to practice it today.',
        seoKeywords: [
          'parenting neurodiverse children',
          'emotional regulation',
          'parent coaching',
          'active listening',
        ],
        ogImage: null,
        noIndex: false,
      },

      // 2 — DRAFT, title and content only
      {
        title: 'The Meltdown Myth: What Tantrums Are Really Telling You',
        slug: 'the-meltdown-myth-what-tantrums-really-mean',
        content: `We call them tantrums. We call them meltdowns. We use those words as though they describe a behavior we need to stop.

But what if we reframed them as communication?

A child who is throwing themselves on the floor in the grocery store is not trying to embarrass you. They are not being manipulative. Their nervous system has been overwhelmed by the sensory environment, the deviation from routine, the hunger they couldn't verbalize, or any number of inputs that crossed their threshold.

The meltdown is the message.

**Draft notes:**
- Add section on sensory triggers
- Include the "window of tolerance" concept
- Case study from a client (anonymized)
- Practical de-escalation steps for public spaces
- Link to regulated adult = regulated child post`,
        excerpt: null,
        status: PostStatus.DRAFT,
        authorId: author.id,
        coverImage: null,
        coverImageAlt: null,
        tags: [],
        publishedAt: null,
        seoTitle: null,
        seoDescription: null,
        seoKeywords: [],
        ogImage: null,
        noIndex: false,
      },

      // 3 — ARCHIVED, title + content + tags
      {
        title: 'Setting Up a Calm-Down Corner That Actually Works',
        slug: 'setting-up-a-calm-down-corner-that-actually-works',
        content: `A calm-down corner is not a punishment. It is not a timeout with better marketing. When created collaboratively with your child and stocked with the right tools for *their* specific sensory profile, it becomes one of the most effective self-regulation supports you can put in your home.

Here is what I have seen work—and what consistently fails.

**What fails**

- Creating the space without involving your child
- Sending a child there when they are already dysregulated (they cannot use it when they need it most unless they have practiced using it when calm)
- Stocking it with items you think are calming, rather than items your child tells you help them

**What works**

- Building it together on a neutral day, framing it as a special spot
- Practicing "visiting" it during calm moments so the body learns it as a safe place
- Including sensory anchors: a specific texture, a familiar scent, a weighted object
- Keeping it free from screens and from adult supervision

**When to archive a resource**

This post is archived because the specific product recommendations are outdated. The principles remain sound. A revised version is in progress.`,
        excerpt:
          'A calm-down corner works only when it is built with your child, practiced during calm moments, and stocked with tools matched to their sensory profile.',
        status: PostStatus.ARCHIVED,
        authorId: author.id,
        coverImage: null,
        coverImageAlt: null,
        tags: ['sensory regulation', 'environment', 'calm-down corner', 'self-regulation tools'],
        publishedAt: new Date('2025-09-01T10:00:00Z'),
        seoTitle: null,
        seoDescription: null,
        seoKeywords: [],
        ogImage: null,
        noIndex: true,
      },
    ],
  })

  console.log('✅ Seeded 3 blog posts (1 published, 1 draft, 1 archived)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

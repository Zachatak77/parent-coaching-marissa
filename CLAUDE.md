# Claude Code Guidelines — Parent Coaching with Marissa

## Project Context

Next.js 14 App Router, TypeScript, Supabase (SSR), Tailwind, shadcn/ui. Two route groups: `(dashboard)` for the coach, `(portal)` for parents. All Supabase interactions are server-side; use `createClient()` for server/API and `createAdminClient()` (service role) only when RLS must be bypassed (e.g. writing another user's row). Email via Resend — always fire-and-forget, never block a user-facing action on email failure.

## Behavioral Guidelines

### 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that **your** changes made unused; leave pre-existing dead code alone.

Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

Define success criteria. Loop until verified.

- Transform tasks into verifiable goals before starting.
- For multi-step tasks, state a brief plan with a verify step for each.
- Weak criteria ("make it work") require clarification before starting, not after mistakes.

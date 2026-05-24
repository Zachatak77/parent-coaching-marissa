/**
 * Prisma v7 requires a driver adapter — new PrismaClient() without one throws.
 * All code must import `prisma` from here rather than instantiating PrismaClient directly.
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  // Strip Prisma-schema-only params the pg driver doesn't understand
  const url = (process.env.DATABASE_URL ?? '')
    .replace(/[?&]pgbouncer=true/i, '')
    .replace(/[?&]connection_limit=\d+/i, '')
    .replace(/\?$/, '')
  const pool = new Pool({
    connectionString: url || undefined,
    ssl: { rejectUnauthorized: false },
  })
  const adapter = new PrismaPg(pool)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter: adapter as any })
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import { PrismaClient } from "@prisma/client"

/* import "server-only" */

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient
}

const prisma = new PrismaClient()

export const db = prisma

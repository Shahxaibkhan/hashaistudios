import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { carpectPrisma: PrismaClient }

export const carpectPrisma = globalForPrisma.carpectPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.carpectPrisma = carpectPrisma

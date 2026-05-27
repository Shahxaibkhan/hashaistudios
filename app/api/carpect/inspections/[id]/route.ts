import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'
import { carpectPrisma } from '@/lib/carpect/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(carpectAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const inspection = await carpectPrisma.inspection.findFirst({
    where: { id: params.id, userId },
    include: {
      vehicle: true,
      images: { orderBy: { createdAt: 'asc' } },
      damages: { orderBy: { createdAt: 'asc' } },
    },
  })
  if (!inspection) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(inspection)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(carpectAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const inspection = await carpectPrisma.inspection.findFirst({ where: { id: params.id, userId } })
  if (!inspection) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const updated = await carpectPrisma.inspection.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(updated)
}

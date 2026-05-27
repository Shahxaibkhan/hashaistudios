import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'
import { carpectPrisma } from '@/lib/carpect/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(carpectAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const vehicle = await carpectPrisma.vehicle.findFirst({
    where: { id: params.id, ownerId: userId },
    include: {
      inspections: {
        orderBy: { createdAt: 'desc' },
        include: { images: true, damages: true },
      },
    },
  })
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(vehicle)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(carpectAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const vehicle = await carpectPrisma.vehicle.findFirst({ where: { id: params.id, ownerId: userId } })
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await carpectPrisma.vehicle.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

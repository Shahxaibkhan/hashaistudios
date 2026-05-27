import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'
import { carpectPrisma } from '@/lib/carpect/prisma'

export async function GET() {
  const session = await getServerSession(carpectAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const vehicles = await carpectPrisma.vehicle.findMany({
    where: { ownerId: userId },
    include: { _count: { select: { inspections: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(vehicles)
}

export async function POST(req: Request) {
  const session = await getServerSession(carpectAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const body = await req.json()
  const { make, model, year, licensePlate, color, vin, notes } = body

  if (!make || !model || !year || !licensePlate || !color) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const vehicle = await carpectPrisma.vehicle.create({
      data: { make, model, year: parseInt(year), licensePlate, color, vin, notes, ownerId: userId },
    })
    return NextResponse.json(vehicle, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'License plate already registered' }, { status: 409 })
  }
}

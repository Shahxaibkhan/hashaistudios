import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'
import { carpectPrisma } from '@/lib/carpect/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  const session = await getServerSession(carpectAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const inspectionId = formData.get('inspectionId') as string
  const angle = formData.get('angle') as string

  if (!file || !inspectionId || !angle) {
    return NextResponse.json({ error: 'file, inspectionId and angle are required' }, { status: 400 })
  }

  const inspection = await carpectPrisma.inspection.findFirst({ where: { id: inspectionId, userId } })
  if (!inspection) return NextResponse.json({ error: 'Inspection not found' }, { status: 404 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${uuidv4()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', inspectionId)

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)

  const url = `/uploads/${inspectionId}/${filename}`

  const image = await carpectPrisma.inspectionImage.create({
    data: { inspectionId, url, angle },
  })

  return NextResponse.json({ id: image.id, url, angle }, { status: 201 })
}

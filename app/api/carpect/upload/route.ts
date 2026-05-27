import { NextResponse } from 'next/server'
import { createCarpectServerClient } from '@/lib/carpect/supabase'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const inspectionId = formData.get('inspectionId') as string
  const angle = formData.get('angle') as string

  if (!file || !inspectionId || !angle) {
    return NextResponse.json({ error: 'file, inspectionId and angle are required' }, { status: 400 })
  }

  const { data: inspection } = await supabase
    .from('carpect_inspections').select('id').eq('id', inspectionId).eq('user_id', user.id).single()
  if (!inspection) return NextResponse.json({ error: 'Inspection not found' }, { status: 404 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${uuidv4()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', inspectionId)

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)

  const url = `/uploads/${inspectionId}/${filename}`

  const { data: image, error } = await supabase.from('carpect_inspection_images').insert({
    inspection_id: inspectionId, url, angle,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: image.id, url, angle }, { status: 201 })
}

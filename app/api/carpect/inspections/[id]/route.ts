import { NextResponse } from 'next/server'
import { createCarpectServerClient } from '@/lib/carpect/supabase'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: inspection, error } = await supabase
    .from('carpect_inspections')
    .select('*, vehicle:carpect_vehicles(*), images:carpect_inspection_images(*), damages:carpect_damages(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()
  if (error || !inspection) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(inspection)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: existing } = await supabase.from('carpect_inspections').select('id').eq('id', params.id).eq('user_id', user.id).single()
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { data: updated, error } = await supabase
    .from('carpect_inspections').update({ ...body, updated_at: new Date().toISOString() }).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(updated)
}

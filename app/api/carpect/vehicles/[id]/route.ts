import { NextResponse } from 'next/server'
import { createCarpectServerClient } from '@/lib/carpect/supabase'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: vehicle, error } = await supabase
    .from('carpect_vehicles')
    .select('*, inspections:carpect_inspections(*, images:carpect_inspection_images(*), damages:carpect_damages(*))')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single()
  if (error || !vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(vehicle)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: vehicle } = await supabase
    .from('carpect_vehicles').select('id').eq('id', params.id).eq('owner_id', user.id).single()
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase.from('carpect_vehicles').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

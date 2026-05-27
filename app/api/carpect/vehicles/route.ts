import { NextResponse } from 'next/server'
import { createCarpectServerClient } from '@/lib/carpect/supabase'

export async function GET() {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: vehicles, error } = await supabase
    .from('carpect_vehicles')
    .select('*, inspections:carpect_inspections(count)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(vehicles)
}

export async function POST(req: Request) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { make, model, year, licensePlate, color, vin, notes } = body
  if (!make || !model || !year || !licensePlate || !color) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: vehicle, error } = await supabase.from('carpect_vehicles').insert({
    make, model, year: parseInt(year), license_plate: licensePlate, color, vin, notes, owner_id: user.id,
  }).select().single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'License plate already registered' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(vehicle, { status: 201 })
}

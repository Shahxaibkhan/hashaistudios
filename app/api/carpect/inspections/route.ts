import { NextResponse } from 'next/server'
import { createCarpectServerClient } from '@/lib/carpect/supabase'

export async function GET(req: Request) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const vehicleId = url.searchParams.get('vehicleId')
  const type = url.searchParams.get('type')

  let query = supabase
    .from('carpect_inspections')
    .select('*, vehicle:carpect_vehicles(*), damages:carpect_damages(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (vehicleId) query = query.eq('vehicle_id', vehicleId)
  if (type) query = query.eq('type', type)

  const { data: inspections, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(inspections)
}

export async function POST(req: Request) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { vehicleId, type, renterName, renterPhone, renterEmail, rentalStart, rentalEnd, preInspectionId, notes } = body
  if (!vehicleId || !type) return NextResponse.json({ error: 'vehicleId and type are required' }, { status: 400 })

  const { data: vehicle } = await supabase.from('carpect_vehicles').select('id').eq('id', vehicleId).eq('owner_id', user.id).single()
  if (!vehicle) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })

  const { data: inspection, error } = await supabase.from('carpect_inspections').insert({
    vehicle_id: vehicleId,
    user_id: user.id,
    type,
    status: 'PENDING',
    renter_name: renterName,
    renter_phone: renterPhone,
    renter_email: renterEmail,
    rental_start: rentalStart || null,
    rental_end: rentalEnd || null,
    pre_inspection_id: preInspectionId || null,
    notes,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(inspection, { status: 201 })
}

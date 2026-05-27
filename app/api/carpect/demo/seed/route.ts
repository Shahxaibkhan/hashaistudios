import { NextResponse } from 'next/server'
import { createCarpectServerClient } from '@/lib/carpect/supabase'

const PRE_REPORT = JSON.stringify({
  overallCondition: 'fair',
  damages: [
    { type: 'scratch', severity: 'minor', location: 'Front bumper (left side)', description: 'Light surface scratch approx. 8cm, paint intact', estimatedCost: 45, isNew: false },
    { type: 'dent', severity: 'moderate', location: 'Rear left door panel', description: 'Small dent approx. 4cm diameter, no paint damage', estimatedCost: 180, isNew: false },
    { type: 'paint_chip', severity: 'minor', location: 'Hood (centre)', description: 'Two small paint chips from stone impacts', estimatedCost: 60, isNew: false },
  ],
  summary: 'Vehicle in fair condition. Three pre-existing minor to moderate damage items documented before rental.',
  recommendations: ['Schedule touch-up paint for hood chips to prevent rust', 'Rear door dent should be repaired at next service', 'Monitor front bumper scratch for any worsening'],
  totalEstimatedCost: 285,
})

const POST_REPORT = JSON.stringify({
  newDamages: [
    { type: 'crack', severity: 'severe', location: 'Rear bumper (right side)', description: 'Clear impact crack approx. 15cm, plastic split — likely parking collision', estimatedCost: 320, isNew: true },
  ],
  existingDamages: [
    { type: 'scratch', severity: 'minor', location: 'Front bumper (left side)', description: 'Light surface scratch approx. 8cm, paint intact', estimatedCost: 45 },
    { type: 'dent', severity: 'moderate', location: 'Rear left door panel', description: 'Small dent approx. 4cm diameter, no paint damage', estimatedCost: 180 },
    { type: 'paint_chip', severity: 'minor', location: 'Hood (centre)', description: 'Two small paint chips from stone impacts', estimatedCost: 60 },
  ],
  summary: '1 new damage detected after rental. Rear bumper crack is consistent with a parking impact. Renter is liable for repair cost of $320.',
  hasNewDamage: true,
  totalNewDamageCost: 320,
})

const CIVIC_PRE_REPORT = JSON.stringify({
  overallCondition: 'good',
  damages: [
    { type: 'scratch', severity: 'minor', location: 'Front left door', description: 'Hairline scratch on door edge, pre-existing', estimatedCost: 35, isNew: false },
  ],
  summary: 'Vehicle in good condition. One minor pre-existing scratch documented.',
  recommendations: ['Touch up door scratch at convenience to prevent rust spread'],
  totalEstimatedCost: 35,
})

const CLEAN_POST_REPORT = JSON.stringify({
  newDamages: [],
  existingDamages: [
    { type: 'scratch', severity: 'minor', location: 'Front left door', description: 'Hairline scratch on door edge, pre-existing', estimatedCost: 35 },
  ],
  summary: 'No new damage detected. Honda Civic returned in the same condition as rented.',
  hasNewDamage: false,
  totalNewDamageCost: 0,
})

export async function POST() {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = user.id

  const { data: existingDemo } = await supabase
    .from('carpect_vehicles').select('id').eq('owner_id', userId).like('license_plate', 'DEMO-%').limit(1).single()
  if (existingDemo) return NextResponse.json({ message: 'Demo data already loaded', alreadyExists: true })

  const now = new Date()
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)

  // Vehicle 1: Toyota Corolla — damage dispute scenario
  const { data: corolla } = await supabase.from('carpect_vehicles').insert({ make: 'Toyota', model: 'Corolla', year: 2022, license_plate: 'DEMO-001', color: 'White', owner_id: userId, notes: 'Demo vehicle — Lahore fleet car #1' }).select().single()
  if (!corolla) return NextResponse.json({ error: 'Failed to create demo vehicle' }, { status: 500 })
  const { data: corollaPre } = await supabase.from('carpect_inspections').insert({
    vehicle_id: corolla.id, user_id: userId,
    type: 'PRE_RENTAL', status: 'COMPLETED',
    renter_name: 'Ali Hassan', renter_phone: '+92 300 1234567',
    rental_start: threeDaysAgo, rental_end: yesterday,
    ai_report: PRE_REPORT,
  }).select().single()
  if (corollaPre) {
    await supabase.from('carpect_damages').insert([
      { inspection_id: corollaPre.id, type: 'scratch', severity: 'minor', location: 'Front bumper (left side)', description: 'Light surface scratch approx. 8cm, paint intact', estimated_cost: 45, is_new: false },
      { inspection_id: corollaPre.id, type: 'dent', severity: 'moderate', location: 'Rear left door panel', description: 'Small dent approx. 4cm diameter, no paint damage', estimated_cost: 180, is_new: false },
      { inspection_id: corollaPre.id, type: 'paint_chip', severity: 'minor', location: 'Hood (centre)', description: 'Two small paint chips from stone impacts', estimated_cost: 60, is_new: false },
    ])
  }
  const { data: corollaPost } = await supabase.from('carpect_inspections').insert({
    vehicle_id: corolla.id, user_id: userId,
    type: 'POST_RENTAL', status: 'COMPLETED',
    renter_name: 'Ali Hassan', renter_phone: '+92 300 1234567',
    rental_start: threeDaysAgo, rental_end: yesterday,
    pre_inspection_id: corollaPre?.id,
    ai_report: POST_REPORT,
  }).select().single()
  if (corollaPost) {
    await supabase.from('carpect_damages').insert([
      { inspection_id: corollaPost.id, type: 'crack', severity: 'severe', location: 'Rear bumper (right side)', description: 'Clear impact crack approx. 15cm, plastic split — likely parking collision', estimated_cost: 320, is_new: true },
      { inspection_id: corollaPost.id, type: 'scratch', severity: 'minor', location: 'Front bumper (left side)', description: 'Light surface scratch approx. 8cm, paint intact', estimated_cost: 45, is_new: false },
      { inspection_id: corollaPost.id, type: 'dent', severity: 'moderate', location: 'Rear left door panel', description: 'Small dent approx. 4cm diameter, no paint damage', estimated_cost: 180, is_new: false },
      { inspection_id: corollaPost.id, type: 'paint_chip', severity: 'minor', location: 'Hood (centre)', description: 'Two small paint chips from stone impacts', estimated_cost: 60, is_new: false },
    ])
  }

  // Vehicle 2: Honda Civic — clean return
  const { data: civic } = await supabase.from('carpect_vehicles').insert({ make: 'Honda', model: 'Civic', year: 2023, license_plate: 'DEMO-002', color: 'Silver', owner_id: userId, notes: 'Demo vehicle — Lahore fleet car #2' }).select().single()
  if (civic) {
    const { data: civicPre } = await supabase.from('carpect_inspections').insert({
      vehicle_id: civic.id, user_id: userId,
      type: 'PRE_RENTAL', status: 'COMPLETED',
      renter_name: 'Fatima Sheikh', renter_phone: '+92 321 9876543',
      rental_start: twoDaysAgo, rental_end: now,
      ai_report: CIVIC_PRE_REPORT,
    }).select().single()
    if (civicPre) {
      await supabase.from('carpect_damages').insert([{ inspection_id: civicPre.id, type: 'scratch', severity: 'minor', location: 'Front left door', description: 'Hairline scratch on door edge, pre-existing', estimated_cost: 35, is_new: false }])
      const { data: civicPost } = await supabase.from('carpect_inspections').insert({
        vehicle_id: civic.id, user_id: userId,
        type: 'POST_RENTAL', status: 'COMPLETED',
        renter_name: 'Fatima Sheikh', renter_phone: '+92 321 9876543',
        rental_start: twoDaysAgo, rental_end: now,
        pre_inspection_id: civicPre.id,
        ai_report: CLEAN_POST_REPORT,
      }).select().single()
      if (civicPost) {
        await supabase.from('carpect_damages').insert([{ inspection_id: civicPost.id, type: 'scratch', severity: 'minor', location: 'Front left door', description: 'Hairline scratch on door edge, pre-existing', estimated_cost: 35, is_new: false }])
      }
    }
  }

  // Vehicle 3: Suzuki Alto — pending inspection
  const { data: alto } = await supabase.from('carpect_vehicles').insert({ make: 'Suzuki', model: 'Alto', year: 2021, license_plate: 'DEMO-003', color: 'Red', owner_id: userId, notes: 'Demo vehicle — awaiting pre-rental inspection' }).select().single()
  if (alto) {
    await supabase.from('carpect_inspections').insert({
      vehicle_id: alto.id, user_id: userId,
      type: 'PRE_RENTAL', status: 'PENDING',
      renter_name: 'Usman Tariq', renter_phone: '+92 333 5551234',
      rental_start: now,
    })
  }

  return NextResponse.json({
    message: 'Demo data loaded successfully',
    vehicles: [
      { name: 'Toyota Corolla (DEMO-001)', status: 'Has damage dispute — new crack found' },
      { name: 'Honda Civic (DEMO-002)', status: 'Clean return — no new damage' },
      { name: 'Suzuki Alto (DEMO-003)', status: 'Pending pre-rental inspection' },
    ],
  })
}

export async function DELETE() {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: demoVehicles } = await supabase
    .from('carpect_vehicles').select('id').eq('owner_id', user.id).like('license_plate', 'DEMO-%')
  const ids = (demoVehicles ?? []).map((v: { id: string }) => v.id)
  if (ids.length === 0) return NextResponse.json({ message: 'No demo data found' })

  await supabase.from('carpect_vehicles').delete().in('id', ids)
  return NextResponse.json({ message: 'Demo data removed' })
}

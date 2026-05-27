import { NextResponse } from 'next/server'
import { createCarpectAdminClient } from '@/lib/carpect/supabase'

export const dynamic = 'force-dynamic'

const DEMO_EMAIL = 'demo@carpect.com'
const DEMO_PASSWORD = 'Demo1234!'

const PRE_REPORT = JSON.stringify({
  overallCondition: 'fair',
  damages: [
    { type: 'scratch', severity: 'minor', location: 'Front bumper (left side)', description: 'Light surface scratch approx. 8cm, paint intact', estimatedCost: 45, isNew: false },
    { type: 'dent', severity: 'moderate', location: 'Rear left door panel', description: 'Small dent approx. 4cm diameter, no paint damage', estimatedCost: 180, isNew: false },
    { type: 'paint_chip', severity: 'minor', location: 'Hood (centre)', description: 'Two small paint chips from stone impacts', estimatedCost: 60, isNew: false },
  ],
  summary: 'Vehicle in fair condition. Three pre-existing minor to moderate damage items documented before rental.',
  recommendations: ['Schedule touch-up paint for hood chips to prevent rust', 'Rear door dent should be repaired at next service'],
  totalEstimatedCost: 285,
})

const POST_REPORT = JSON.stringify({
  newDamages: [{ type: 'crack', severity: 'severe', location: 'Rear bumper (right side)', description: 'Clear impact crack approx. 15cm, plastic split — likely parking collision', estimatedCost: 320, isNew: true }],
  existingDamages: [
    { type: 'scratch', severity: 'minor', location: 'Front bumper (left side)', description: 'Light surface scratch', estimatedCost: 45 },
    { type: 'dent', severity: 'moderate', location: 'Rear left door panel', description: 'Small dent', estimatedCost: 180 },
    { type: 'paint_chip', severity: 'minor', location: 'Hood (centre)', description: 'Paint chips', estimatedCost: 60 },
  ],
  summary: '1 new damage detected after rental. Rear bumper crack consistent with a parking impact. Renter liable for $320.',
  hasNewDamage: true,
  totalNewDamageCost: 320,
})

const CIVIC_PRE_REPORT = JSON.stringify({
  overallCondition: 'good',
  damages: [{ type: 'scratch', severity: 'minor', location: 'Front left door', description: 'Hairline scratch on door edge', estimatedCost: 35, isNew: false }],
  summary: 'Vehicle in good condition. One minor pre-existing scratch documented.',
  recommendations: ['Touch up door scratch at convenience'],
  totalEstimatedCost: 35,
})

const CLEAN_POST_REPORT = JSON.stringify({
  newDamages: [],
  existingDamages: [{ type: 'scratch', severity: 'minor', location: 'Front left door', description: 'Hairline scratch', estimatedCost: 35 }],
  summary: 'No new damage detected. Honda Civic returned in the same condition as rented.',
  hasNewDamage: false,
  totalNewDamageCost: 0,
})

async function seedDemoData(admin: ReturnType<typeof createCarpectAdminClient>, userId: string) {
  const now = new Date()
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)

  const { data: corolla } = await admin.from('carpect_vehicles').insert({ make: 'Toyota', model: 'Corolla', year: 2022, license_plate: 'LHR-5521', color: 'White', owner_id: userId }).select().single()
  if (!corolla) return
  const { data: corollaPre } = await admin.from('carpect_inspections').insert({
    vehicle_id: corolla.id, user_id: userId, type: 'PRE_RENTAL', status: 'COMPLETED',
    renter_name: 'Ali Hassan', renter_phone: '+92 300 1234567',
    rental_start: threeDaysAgo, rental_end: yesterday, ai_report: PRE_REPORT,
  }).select().single()
  if (corollaPre) {
    await admin.from('carpect_damages').insert([
      { inspection_id: corollaPre.id, type: 'scratch', severity: 'minor', location: 'Front bumper (left side)', description: 'Light surface scratch approx. 8cm, paint intact', estimated_cost: 45, is_new: false },
      { inspection_id: corollaPre.id, type: 'dent', severity: 'moderate', location: 'Rear left door panel', description: 'Small dent approx. 4cm diameter, no paint damage', estimated_cost: 180, is_new: false },
      { inspection_id: corollaPre.id, type: 'paint_chip', severity: 'minor', location: 'Hood (centre)', description: 'Two small paint chips from stone impacts', estimated_cost: 60, is_new: false },
    ])
    const { data: corollaPost } = await admin.from('carpect_inspections').insert({
      vehicle_id: corolla.id, user_id: userId, type: 'POST_RENTAL', status: 'COMPLETED',
      renter_name: 'Ali Hassan', renter_phone: '+92 300 1234567',
      rental_start: threeDaysAgo, rental_end: yesterday, pre_inspection_id: corollaPre.id, ai_report: POST_REPORT,
    }).select().single()
    if (corollaPost) {
      await admin.from('carpect_damages').insert([
        { inspection_id: corollaPost.id, type: 'crack', severity: 'severe', location: 'Rear bumper (right side)', description: 'Clear impact crack approx. 15cm, plastic split', estimated_cost: 320, is_new: true },
        { inspection_id: corollaPost.id, type: 'scratch', severity: 'minor', location: 'Front bumper (left side)', description: 'Light surface scratch', estimated_cost: 45, is_new: false },
        { inspection_id: corollaPost.id, type: 'dent', severity: 'moderate', location: 'Rear left door panel', description: 'Small dent', estimated_cost: 180, is_new: false },
        { inspection_id: corollaPost.id, type: 'paint_chip', severity: 'minor', location: 'Hood (centre)', description: 'Paint chips', estimated_cost: 60, is_new: false },
      ])
    }
  }

  const { data: civic } = await admin.from('carpect_vehicles').insert({ make: 'Honda', model: 'Civic', year: 2023, license_plate: 'KHI-7743', color: 'Silver', owner_id: userId }).select().single()
  if (civic) {
    const { data: civicPre } = await admin.from('carpect_inspections').insert({
      vehicle_id: civic.id, user_id: userId, type: 'PRE_RENTAL', status: 'COMPLETED',
      renter_name: 'Fatima Sheikh', renter_phone: '+92 321 9876543',
      rental_start: twoDaysAgo, rental_end: now, ai_report: CIVIC_PRE_REPORT,
    }).select().single()
    if (civicPre) {
      await admin.from('carpect_damages').insert([{ inspection_id: civicPre.id, type: 'scratch', severity: 'minor', location: 'Front left door', description: 'Hairline scratch on door edge', estimated_cost: 35, is_new: false }])
      const { data: civicPost } = await admin.from('carpect_inspections').insert({
        vehicle_id: civic.id, user_id: userId, type: 'POST_RENTAL', status: 'COMPLETED',
        renter_name: 'Fatima Sheikh', renter_phone: '+92 321 9876543',
        rental_start: twoDaysAgo, rental_end: now, pre_inspection_id: civicPre.id, ai_report: CLEAN_POST_REPORT,
      }).select().single()
      if (civicPost) await admin.from('carpect_damages').insert([{ inspection_id: civicPost.id, type: 'scratch', severity: 'minor', location: 'Front left door', description: 'Hairline scratch', estimated_cost: 35, is_new: false }])
    }
  }

  await admin.from('carpect_vehicles').insert({ make: 'Suzuki', model: 'Alto', year: 2021, license_plate: 'ISB-3310', color: 'Red', owner_id: userId })
}

export async function GET() {
  try {
    const admin = createCarpectAdminClient()
    const { data: { users } } = await admin.auth.admin.listUsers()
    const existing = users.find(u => u.email === DEMO_EMAIL)

    if (!existing) {
      const { data: created, error } = await admin.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { name: 'Demo User', business_name: 'Lahore Premium Rentals (Demo)', phone: '+92 300 0000000' },
      })
      if (error) throw error
      await seedDemoData(admin, created.user.id)
    }

    return NextResponse.json({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[demo/instant] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

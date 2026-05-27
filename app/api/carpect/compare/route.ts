import { NextResponse } from 'next/server'
import { createCarpectServerClient } from '@/lib/carpect/supabase'
import { compareInspections } from '@/lib/carpect/claude'
import { readFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postInspectionId } = await req.json()

  const { data: postInspection } = await supabase
    .from('carpect_inspections')
    .select('*, images:carpect_inspection_images(*), damages:carpect_damages(*)')
    .eq('id', postInspectionId).eq('user_id', user.id).single()
  if (!postInspection) return NextResponse.json({ error: 'Post-rental inspection not found' }, { status: 404 })
  if (!postInspection.pre_inspection_id) return NextResponse.json({ error: 'No pre-rental inspection linked' }, { status: 400 })

  const { data: preInspection } = await supabase
    .from('carpect_inspections')
    .select('*, damages:carpect_damages(*)')
    .eq('id', postInspection.pre_inspection_id).eq('user_id', user.id).single()
  if (!preInspection) return NextResponse.json({ error: 'Pre-rental inspection not found' }, { status: 404 })

  type PreDmg = { type: 'scratch'|'dent'|'crack'|'paint_chip'|'broken'|'missing'|'other'; severity: 'minor'|'moderate'|'severe'; location: string; description: string; estimated_cost?: number }
  const preDamages = (preInspection.damages as PreDmg[]).map(d => ({
    type: d.type, severity: d.severity, location: d.location, description: d.description, estimatedCost: d.estimated_cost,
  }))

  await supabase.from('carpect_inspections').update({ status: 'IN_PROGRESS' }).eq('id', postInspectionId)

  const allNewDamages: Array<{ type: string; severity: string; location: string; description: string; estimated_cost?: number; is_new: boolean }> = []
  let totalNewCost = 0

  for (const image of (postInspection.images as Array<{ id: string; url: string }>)) {
    try {
      const filePath = path.join(process.cwd(), 'public', image.url)
      const buffer = await readFile(filePath)
      const base64 = buffer.toString('base64')
      const ext = image.url.split('.').pop()?.toLowerCase() || 'jpeg'
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
      const result = await compareInspections(base64, preDamages, mimeType)
      for (const dmg of result.newDamages) {
        allNewDamages.push({ ...dmg, estimated_cost: dmg.estimatedCost, is_new: true })
        totalNewCost += dmg.estimatedCost || 0
      }
    } catch (err) {
      console.error(`Failed to compare image ${image.id}:`, err)
    }
  }

  const comparisonReport = {
    newDamages: allNewDamages,
    existingDamages: preDamages,
    summary: allNewDamages.length > 0
      ? `${allNewDamages.length} new damage(s) detected after rental. Estimated repair cost: $${totalNewCost.toFixed(2)}.`
      : 'No new damage detected. Car returned in same condition as rented.',
    hasNewDamage: allNewDamages.length > 0,
    totalNewDamageCost: totalNewCost,
  }

  await supabase.from('carpect_damages').delete().eq('inspection_id', postInspectionId)
  const damageInserts = [
    ...allNewDamages.map(d => ({ inspection_id: postInspectionId, type: d.type, severity: d.severity, location: d.location, description: d.description, estimated_cost: d.estimated_cost, is_new: true })),
    ...preDamages.map(d => ({ inspection_id: postInspectionId, type: d.type, severity: d.severity, location: d.location, description: d.description, estimated_cost: d.estimatedCost, is_new: false })),
  ]
  if (damageInserts.length > 0) await supabase.from('carpect_damages').insert(damageInserts)
  await supabase.from('carpect_inspections').update({ status: 'COMPLETED', ai_report: JSON.stringify(comparisonReport) }).eq('id', postInspectionId)

  return NextResponse.json(comparisonReport)
}

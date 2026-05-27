import { NextResponse } from 'next/server'
import { createCarpectServerClient } from '@/lib/carpect/supabase'
import { analyzeCarImage } from '@/lib/carpect/claude'
import { readFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { inspectionId } = await req.json()
  if (!inspectionId) return NextResponse.json({ error: 'inspectionId required' }, { status: 400 })

  const { data: inspection } = await supabase
    .from('carpect_inspections')
    .select('*, images:carpect_inspection_images(*)')
    .eq('id', inspectionId).eq('user_id', user.id).single()
  if (!inspection) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const images = (inspection.images as Array<{ id: string; url: string }>)
  if (images.length === 0) return NextResponse.json({ error: 'No images uploaded' }, { status: 400 })

  await supabase.from('carpect_inspections').update({ status: 'IN_PROGRESS' }).eq('id', inspectionId)

  const allDamages: Array<{ type: string; severity: string; location: string; description: string; estimated_cost?: number; is_new: boolean }> = []
  const allRecommendations: string[] = []
  let worstCondition = 'excellent'
  const conditionRank = { excellent: 0, good: 1, fair: 2, poor: 3 }

  for (const image of images) {
    try {
      const filePath = path.join(process.cwd(), 'public', image.url)
      const buffer = await readFile(filePath)
      const base64 = buffer.toString('base64')
      const ext = image.url.split('.').pop()?.toLowerCase() || 'jpeg'
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
      const result = await analyzeCarImage(base64, mimeType)
      for (const dmg of result.damages) allDamages.push({ ...dmg, estimated_cost: dmg.estimatedCost, is_new: false })
      allRecommendations.push(...result.recommendations)
      if ((conditionRank[result.overallCondition as keyof typeof conditionRank] || 0) > (conditionRank[worstCondition as keyof typeof conditionRank] || 0)) {
        worstCondition = result.overallCondition
      }
    } catch (err) {
      console.error(`Failed to analyze image ${image.id}:`, err)
    }
  }

  const totalCost = allDamages.reduce((s, d) => s + (d.estimated_cost || 0), 0)
  const aiReport = {
    overallCondition: worstCondition,
    damages: allDamages,
    summary: `Inspection completed. ${allDamages.length} damage item(s) found. Overall condition: ${worstCondition}.`,
    recommendations: allRecommendations.filter((v, i, a) => a.indexOf(v) === i),
    totalEstimatedCost: totalCost,
  }

  await supabase.from('carpect_damages').delete().eq('inspection_id', inspectionId)
  if (allDamages.length > 0) {
    await supabase.from('carpect_damages').insert(
      allDamages.map(d => ({
        inspection_id: inspectionId,
        type: d.type,
        severity: d.severity,
        location: d.location,
        description: d.description,
        estimated_cost: d.estimated_cost,
        is_new: false,
      }))
    )
  }
  await supabase.from('carpect_inspections').update({ status: 'COMPLETED', ai_report: JSON.stringify(aiReport) }).eq('id', inspectionId)

  return NextResponse.json(aiReport)
}


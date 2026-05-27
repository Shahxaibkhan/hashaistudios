import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'
import { carpectPrisma } from '@/lib/carpect/prisma'
import { analyzeCarImage } from '@/lib/carpect/claude'
import { readFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const session = await getServerSession(carpectAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const { inspectionId } = await req.json()

  if (!inspectionId) return NextResponse.json({ error: 'inspectionId required' }, { status: 400 })

  const inspection = await carpectPrisma.inspection.findFirst({
    where: { id: inspectionId, userId },
    include: { images: true },
  })
  if (!inspection) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (inspection.images.length === 0) return NextResponse.json({ error: 'No images uploaded' }, { status: 400 })

  await carpectPrisma.inspection.update({ where: { id: inspectionId }, data: { status: 'IN_PROGRESS' } })

  const allDamages: Array<{
    type: string; severity: string; location: string; description: string; estimatedCost?: number; isNew: boolean
  }> = []
  const allRecommendations: string[] = []
  let worstCondition = 'excellent'
  let totalCost = 0

  const conditionRank = { excellent: 0, good: 1, fair: 2, poor: 3 }

  for (const image of inspection.images) {
    try {
      const filePath = path.join(process.cwd(), 'public', image.url)
      const buffer = await readFile(filePath)
      const base64 = buffer.toString('base64')
      const ext = image.url.split('.').pop()?.toLowerCase() || 'jpeg'
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'

      const result = await analyzeCarImage(base64, mimeType)

      for (const dmg of result.damages) {
        allDamages.push({ ...dmg, isNew: false })
        totalCost += dmg.estimatedCost || 0
      }
      allRecommendations.push(...result.recommendations)

      if ((conditionRank[result.overallCondition] || 0) > (conditionRank[worstCondition as keyof typeof conditionRank] || 0)) {
        worstCondition = result.overallCondition
      }
    } catch (err) {
      console.error(`Failed to analyze image ${image.id}:`, err)
    }
  }

  const uniqueRecommendations = allRecommendations.filter((v, i, a) => a.indexOf(v) === i)

  const aiReport = {
    overallCondition: worstCondition,
    damages: allDamages,
    summary: `Inspection completed. ${allDamages.length} damage item(s) found. Overall condition: ${worstCondition}.`,
    recommendations: uniqueRecommendations,
    totalEstimatedCost: totalCost,
  }

  await carpectPrisma.$transaction([
    carpectPrisma.damage.deleteMany({ where: { inspectionId } }),
    ...allDamages.map(d =>
      carpectPrisma.damage.create({
        data: {
          inspectionId,
          type: d.type,
          severity: d.severity,
          location: d.location,
          description: d.description,
          estimatedCost: d.estimatedCost,
          isNew: false,
        },
      })
    ),
    carpectPrisma.inspection.update({
      where: { id: inspectionId },
      data: { status: 'COMPLETED', aiReport: JSON.stringify(aiReport) },
    }),
  ])

  return NextResponse.json(aiReport)
}

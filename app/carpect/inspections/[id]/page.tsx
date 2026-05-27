import { createCarpectServerClient } from '@/lib/carpect/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, FileText, Car, AlertTriangle, CheckCircle } from 'lucide-react'
import { formatDate, formatCurrency, severityColor } from '@/lib/carpect/utils'
import Image from 'next/image'

export default async function CarPectInspectionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user!.id

  const { data: inspection } = await supabase
    .from('carpect_inspections')
    .select('*, vehicle:carpect_vehicles(*), images:carpect_inspection_images(*), damages:carpect_damages(*)')
    .eq('id', params.id)
    .eq('user_id', userId)
    .order('created_at', { ascending: true, referencedTable: 'carpect_inspection_images' })
    .order('is_new', { ascending: false, referencedTable: 'carpect_damages' })
    .single()

  if (!inspection) notFound()

  const isCompleted = inspection.status === 'COMPLETED'

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/carpect/inspections" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {inspection.vehicle.make} {inspection.vehicle.model} — {inspection.type.replace('_', ' ')}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{formatDate(inspection.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          {!isCompleted && (
            <Link
              href={`/carpect/inspections/${params.id}/capture`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              {(inspection.images as unknown[]).length > 0 ? 'Continue Capture' : 'Start Capture'}
            </Link>
          )}
          {isCompleted && (
            <Link
              href={`/carpect/inspections/${params.id}/report`}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Report
            </Link>
          )}
        </div>
      </div>

      <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
        isCompleted ? 'bg-green-50 border border-green-200' :
        inspection.status === 'IN_PROGRESS' ? 'bg-blue-50 border border-blue-200' :
        'bg-gray-50 border border-gray-200'
      }`}>
        {isCompleted ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <Camera className="w-5 h-5 text-blue-600 shrink-0" />}
        <div>
          <p className={`text-sm font-semibold ${isCompleted ? 'text-green-800' : 'text-blue-800'}`}>
            {isCompleted ? 'Inspection Complete' : `Status: ${inspection.status.replace('_', ' ')}`}
          </p>
          <p className={`text-xs mt-0.5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
            {isCompleted
              ? `${(inspection.damages as unknown[]).length} damage(s) found · ${(inspection.images as unknown[]).length} photos taken`
              : 'Upload photos and run AI analysis to complete this inspection'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-400" /> Details
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Vehicle</p>
                <p className="font-medium text-gray-800">{(inspection.vehicle as { make: string; model: string; year: number }).make} {(inspection.vehicle as { make: string; model: string; year: number }).model} {(inspection.vehicle as { make: string; model: string; year: number }).year}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">License Plate</p>
                <p className="font-medium text-gray-800">{(inspection.vehicle as { license_plate: string }).license_plate}</p>
              </div>
              {inspection.renter_name && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Renter</p>
                  <p className="font-medium text-gray-800">{inspection.renter_name}</p>
                </div>
              )}
              {inspection.renter_phone && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Phone</p>
                  <p className="font-medium text-gray-800">{inspection.renter_phone}</p>
                </div>
              )}
              {inspection.rental_start && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Rental Start</p>
                  <p className="font-medium text-gray-800">{formatDate(inspection.rental_start)}</p>
                </div>
              )}
              {inspection.rental_end && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Rental End</p>
                  <p className="font-medium text-gray-800">{formatDate(inspection.rental_end)}</p>
                </div>
              )}
            </div>
          </div>

          {inspection.damages.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Damage Report ({(inspection.damages as unknown[]).length})
              </h2>
              <div className="space-y-3">
                {(inspection.damages as Array<{ id: string; severity: string; type: string; location: string; description: string; is_new: boolean; estimated_cost?: number }>).map(d => (
                  <div key={d.id} className={`p-3.5 rounded-lg border ${d.isNew ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColor(d.severity)}`}>
                            {d.severity}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">{d.type.replace('_', ' ')}</span>
                          {d.is_new && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">NEW</span>}
                        </div>
                        <p className="text-sm font-medium text-gray-800">{d.location}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
                      </div>
                      {d.estimated_cost && (
                        <span className="text-sm font-semibold text-gray-900 shrink-0">{formatCurrency(d.estimated_cost)}</span>
                      )}
                    </div>
                  </div>
                ))}
                {(inspection.damages as Array<{ estimated_cost?: number }>).some(d => d.estimated_cost) && (
                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-900">
                      Total: {formatCurrency((inspection.damages as Array<{ estimated_cost?: number }>).reduce((s, d) => s + (d.estimated_cost || 0), 0))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-400" />
              Photos ({(inspection.images as unknown[]).length})
            </h2>
            {(inspection.images as unknown[]).length === 0 ? (
              <div className="text-center py-8">
                <Camera className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No photos yet</p>
                <Link href={`/carpect/inspections/${params.id}/capture`} className="mt-2 inline-block text-xs text-blue-600 hover:underline">
                  Start capturing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {(inspection.images as Array<{ id: string; url: string; angle: string }>).map(img => (
                  <div key={img.id} className="relative">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                      <Image src={img.url} alt={img.angle} fill className="object-cover" sizes="150px" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center capitalize">{img.angle.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

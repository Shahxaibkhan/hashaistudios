import { getServerSession } from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'
import { carpectPrisma } from '@/lib/carpect/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Car, Plus, ClipboardList } from 'lucide-react'
import { formatDate } from '@/lib/carpect/utils'

export default async function CarPectVehicleDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(carpectAuthOptions)
  const userId = (session?.user as { id: string }).id

  const vehicle = await carpectPrisma.vehicle.findFirst({
    where: { id: params.id, ownerId: userId },
    include: {
      inspections: {
        orderBy: { createdAt: 'desc' },
        include: { damages: true },
      },
    },
  })
  if (!vehicle) notFound()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/carpect/vehicles" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{vehicle.make} {vehicle.model}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{vehicle.licensePlate} · {vehicle.year} · {vehicle.color}</p>
        </div>
        <Link
          href={`/carpect/inspections/new?vehicleId=${vehicle.id}`}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Inspection
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Make', value: vehicle.make },
            { label: 'Model', value: vehicle.model },
            { label: 'Year', value: vehicle.year },
            { label: 'Color', value: vehicle.color },
            { label: 'License Plate', value: vehicle.licensePlate },
            { label: 'VIN', value: vehicle.vin || '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        {vehicle.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-gray-600">{vehicle.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Inspection History</h2>
          <Link href={`/carpect/inspections/new?vehicleId=${vehicle.id}`}
            className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:underline">
            <Plus className="w-3.5 h-3.5" /> New
          </Link>
        </div>
        {vehicle.inspections.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No inspections for this vehicle yet</p>
            <Link href={`/carpect/inspections/new?vehicleId=${vehicle.id}`} className="mt-3 inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:underline">
              <Plus className="w-3.5 h-3.5" /> Create inspection
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {vehicle.inspections.map(insp => (
              <Link key={insp.id} href={`/carpect/inspections/${insp.id}`} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${insp.type === 'PRE_RENTAL' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{insp.type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(insp.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {insp.damages.length > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      {insp.damages.length} damage{insp.damages.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    insp.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    insp.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {insp.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

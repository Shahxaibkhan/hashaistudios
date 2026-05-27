import { createCarpectServerClient } from '@/lib/carpect/supabase'
import Link from 'next/link'
import { Car, ClipboardList, AlertTriangle, CheckCircle, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import CarPectDemoButton from '@/components/carpect/DemoButton'
import { formatDate } from '@/lib/carpect/utils'

export default async function CarPectDashboardPage() {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user!.id

  const [{ count: vehicleCount }, { count: totalInspections }, { count: completedInspections }, { data: recentInspections }] = await Promise.all([
    supabase.from('carpect_vehicles').select('*', { count: 'exact', head: true }).eq('owner_id', userId),
    supabase.from('carpect_inspections').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('carpect_inspections').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'COMPLETED'),
    supabase.from('carpect_inspections').select('*, vehicle:carpect_vehicles(*), damages:carpect_damages(*)').eq('user_id', userId).order('created_at', { ascending: false }).limit(6),
  ])

  const { count: damagesFound } = await supabase
    .from('carpect_damages').select('id, inspection:carpect_inspections!inner(user_id)', { count: 'exact', head: true })
    .eq('is_new', true).eq('carpect_inspections.user_id', userId)

  const { count: demoVehicleCount } = await supabase
    .from('carpect_vehicles').select('*', { count: 'exact', head: true })
    .eq('owner_id', userId).like('license_plate', 'DEMO-%')
  const hasDemoData = (demoVehicleCount ?? 0) > 0

  const stats = [
    { label: 'Fleet Vehicles', value: vehicleCount ?? 0, icon: Car, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: 'Total Inspections', value: totalInspections ?? 0, icon: ClipboardList, gradient: 'from-violet-500 to-violet-600', shadow: 'shadow-violet-500/20' },
    { label: 'Completed', value: completedInspections ?? 0, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
    { label: 'New Damages', value: damagesFound ?? 0, icon: AlertTriangle, gradient: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/20' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Good to see you, <span className="font-semibold text-gray-600">{user?.user_metadata?.name?.split(' ')[0] || 'there'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <CarPectDemoButton hasData={hasDemoData} />
          <Link href="/carpect/inspections/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-px">
            <Plus className="w-4 h-4" />
            New Inspection
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, gradient, shadow }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg ${shadow}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-200" />
            </div>
            <div className="text-3xl font-black text-gray-900 tracking-tight">{value}</div>
            <div className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div>
            <h2 className="font-black text-gray-900 tracking-tight">Recent Inspections</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest activity across your fleet</p>
          </div>
          <Link href="/carpect/inspections" className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentInspections.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-4">No inspections yet</p>
            <Link href="/carpect/inspections/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Create first inspection
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(recentInspections ?? []).map(insp => (
              <Link key={insp.id} href={`/carpect/inspections/${insp.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Car className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{(insp.vehicle as { make: string; model: string }).make} {(insp.vehicle as { make: string; model: string }).model}</p>
                    <p className="text-xs text-gray-400">{(insp.vehicle as { license_plate: string }).license_plate} · {insp.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {(insp.damages as unknown[]).length > 0 && (
                    <span className="text-xs text-orange-500 font-medium">{(insp.damages as unknown[]).length} damage{(insp.damages as unknown[]).length !== 1 ? 's' : ''}</span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    insp.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    insp.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{insp.status.replace('_', ' ')}</span>
                  <span className="text-xs text-gray-400">{formatDate(insp.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

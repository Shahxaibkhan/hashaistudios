'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Vehicle { id: string; make: string; model: string; year: number; licensePlate: string }
interface Inspection { id: string; type: string; status: string; createdAt: string }

export default function CarPectNewInspectionPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [preInspections, setPreInspections] = useState<Inspection[]>([])
  const [form, setForm] = useState({
    vehicleId: params.get('vehicleId') || '',
    type: 'PRE_RENTAL',
    renterName: '', renterPhone: '', renterEmail: '',
    rentalStart: '', rentalEnd: '',
    preInspectionId: '', notes: '',
  })

  useEffect(() => {
    fetch('/api/carpect/vehicles').then(r => r.json()).then(setVehicles)
  }, [])

  useEffect(() => {
    if (form.vehicleId && form.type === 'POST_RENTAL') {
      fetch(`/api/carpect/inspections?vehicleId=${form.vehicleId}&type=PRE_RENTAL`)
        .then(r => r.json())
        .then((all: Inspection[]) => setPreInspections(all.filter(i => i.status === 'COMPLETED')))
        .catch(() => setPreInspections([]))
    } else {
      setPreInspections([])
    }
  }, [form.vehicleId, form.type])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.vehicleId) return toast.error('Please select a vehicle')
    setLoading(true)
    try {
      const res = await fetch('/api/carpect/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Inspection created!')
      router.push(`/carpect/inspections/${data.id}/capture`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create')
    } finally {
      setLoading(false)
    }
  }

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/carpect/inspections" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Inspection</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create a pre or post-rental inspection</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle *</label>
              <select
                required value={form.vehicleId} onChange={f('vehicleId')}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.make} {v.model} ({v.year}) — {v.licensePlate}</option>
                ))}
              </select>
              {vehicles.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">No vehicles found. <Link href="/carpect/vehicles/new" className="text-blue-600 hover:underline">Add one first</Link></p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Inspection Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {(['PRE_RENTAL', 'POST_RENTAL'] as const).map(type => (
                  <label key={type} className={`flex items-center gap-3 p-3.5 border-2 rounded-lg cursor-pointer transition-colors ${
                    form.type === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input type="radio" name="type" value={type} checked={form.type === type}
                      onChange={f('type')} className="sr-only" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.type === type ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {form.type === type && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {form.type === 'POST_RENTAL' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Link Pre-Rental Inspection</label>
                <select value={form.preInspectionId} onChange={f('preInspectionId')}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select pre-rental inspection (optional)</option>
                  {preInspections.map(i => (
                    <option key={i.id} value={i.id}>Inspection — {new Date(i.createdAt).toLocaleDateString()}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Renter Information <span className="text-gray-400 font-normal">(optional)</span></p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Renter name</label>
                  <input type="text" value={form.renterName} onChange={f('renterName')}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ahmed Khan" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                  <input type="tel" value={form.renterPhone} onChange={f('renterPhone')}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+92 300..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Rental start</label>
                  <input type="datetime-local" value={form.rentalStart} onChange={f('rentalStart')}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Rental end</label>
                  <input type="datetime-local" value={form.rentalEnd} onChange={f('rentalEnd')}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={f('notes')} rows={3}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Any additional notes..." />
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-md shadow-blue-500/20">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Inspection & Capture Photos'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

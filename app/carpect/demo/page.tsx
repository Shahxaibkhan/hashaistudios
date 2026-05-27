'use client'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, CheckCircle } from 'lucide-react'

const STEPS = [
  'Setting up demo account…',
  'Loading sample vehicles…',
  'Adding inspection data…',
  'Signing you in…',
]

export default function CarPectDemoPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    async function startDemo() {
      try {
        setStep(0)
        const res = await fetch('/api/carpect/demo/instant')
        if (!res.ok) throw new Error('Failed to prepare demo')
        const { email, password } = await res.json()

        setStep(3)
        const result = await signIn('credentials', { email, password, redirect: false })
        if (result?.error) throw new Error('Sign-in failed')

        router.push('/carpect/dashboard')
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }

    const timers = STEPS.slice(0, 3).map((_, i) =>
      setTimeout(() => setStep(i + 1), (i + 1) * 700)
    )
    setTimeout(startDemo, 2200)

    return () => timers.forEach(clearTimeout)
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline text-sm">Try again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Launching Demo</h1>
        <p className="text-gray-500 text-sm mb-8">Setting up your CarPect demo account…</p>

        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              i < step ? 'bg-green-50 border border-green-200' :
              i === step ? 'bg-blue-50 border border-blue-200' :
              'bg-gray-50 border border-gray-100 opacity-40'
            }`}>
              <div className="w-5 h-5 shrink-0">
                {i < step ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : i === step ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                i < step ? 'text-green-700' : i === step ? 'text-blue-700' : 'text-gray-400'
              }`}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

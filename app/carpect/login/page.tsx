'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, Loader2, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createBrowserSupabaseClient } from '@/lib/hungerai/supabase'

export default function CarPectLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(false)
    if (error) {
      toast.error('Invalid email or password')
    } else {
      router.push('/carpect/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex w-1/2 mesh-bg flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <Link href="/carpect" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">CarPect</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Protect your fleet.<br />
            <span className="gradient-text">Eliminate disputes.</span>
          </h2>
          <p className="text-gray-400 mb-8">AI-powered inspection that takes 3 minutes and saves thousands.</p>
          <div className="space-y-3">
            {[
              'Detect damage before every rental',
              'Compare before/after automatically',
              'Generate PDF reports instantly',
            ].map(point => (
              <div key={point} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs relative z-10">© 2024 CarPect</p>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/carpect" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900">CarPect</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-1.5 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" required autoComplete="email"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password" required autoComplete="current-password"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-all shadow-lg shadow-blue-500/25 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/carpect/register" className="text-blue-600 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link href="/carpect/demo" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
              Try the live demo instead →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import { createCarpectServerClient } from '@/lib/carpect/supabase'
import { redirect } from 'next/navigation'
import CarPectSidebar from '@/components/carpect/Sidebar'

export default async function CarPectDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createCarpectServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/carpect/login')

  const meta = user.user_metadata
  const displayUser = {
    name: meta?.name || user.email?.split('@')[0] || 'User',
    email: user.email ?? '',
  }

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      <CarPectSidebar user={displayUser} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

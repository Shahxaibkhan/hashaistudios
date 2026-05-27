import { getServerSession } from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'
import { redirect } from 'next/navigation'
import CarPectSidebar from '@/components/carpect/Sidebar'

export default async function CarPectDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(carpectAuthOptions)
  if (!session) redirect('/carpect/login')

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      <CarPectSidebar user={session.user!} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

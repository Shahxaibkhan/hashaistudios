import './carpect.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import CarPectSessionProvider from '@/components/carpect/SessionProvider'
import { getServerSession } from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'

export const metadata: Metadata = {
  title: 'CarPect — AI Car Damage Detection',
  description: 'AI-powered car damage inspection and comparison for rental businesses',
}

export default async function CarPectLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(carpectAuthOptions)

  return (
    <div className="carpect fixed inset-0 z-50 overflow-auto bg-gray-50">
      <CarPectSessionProvider session={session}>
        {children}
        <Toaster position="top-right" />
      </CarPectSessionProvider>
    </div>
  )
}

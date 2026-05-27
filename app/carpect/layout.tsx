import './carpect.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'CarPect — AI Car Damage Detection',
  description: 'AI-powered car damage inspection and comparison for rental businesses',
}

export default function CarPectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="carpect fixed inset-0 z-50 overflow-auto bg-gray-50">
      {children}
      <Toaster position="top-right" />
    </div>
  )
}

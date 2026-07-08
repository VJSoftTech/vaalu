import { Outlet } from 'react-router-dom'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { useVisitorTracking } from '@/hooks/useVisitorTracking'
import { useVisitorHeartbeat } from '@/hooks/useVisitorHeartbeat'

export default function PublicLayout() {
  useVisitorTracking()
  useVisitorHeartbeat()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

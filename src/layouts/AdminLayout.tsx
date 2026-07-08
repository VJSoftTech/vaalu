import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/common/AdminSidebar'
import AdminHeader from '@/components/common/AdminHeader'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen flex bg-muted/30">
      <AdminSidebar />
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 print:ml-0',
          sidebarOpen ? 'ml-64' : 'ml-16',
        )}
      >
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

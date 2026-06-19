import { Menu, Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore, useAuthStore } from '@/store'
import { useAuth } from '@/hooks/useAuth'

export default function AdminHeader() {
  const { toggleSidebar } = useUIStore()
  const { user } = useAuthStore()
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur h-14 flex items-center px-4 gap-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium hidden sm:inline">{user?.name}</span>
        <Button variant="ghost" size="icon" onClick={logout} title="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

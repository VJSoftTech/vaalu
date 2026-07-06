import { Menu, LogOut, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
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

      <Link
        to="/"
        title="Go to Homepage"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-br from-primary to-amber-500 text-primary-foreground shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium hidden sm:inline">{user?.name}</span>
        <Button variant="ghost" size="icon" onClick={logout} title="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

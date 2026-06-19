import { useAuthStore } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Profile() {
  const { user } = useAuthStore()
  const { logout } = useAuth()

  return (
    <div className="container py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Card>
        <CardHeader><CardTitle>Account Details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><span className="text-muted-foreground text-sm">Name</span><p className="font-medium">{user?.name}</p></div>
          <div><span className="text-muted-foreground text-sm">Email</span><p className="font-medium">{user?.email}</p></div>
          <div><span className="text-muted-foreground text-sm">Role</span><p className="font-medium capitalize">{user?.role}</p></div>
          <Button variant="destructive" className="w-full mt-4" onClick={logout}>Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  )
}

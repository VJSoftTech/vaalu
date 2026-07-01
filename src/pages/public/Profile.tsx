import { useAuthStore } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Profile() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="container py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">{t.nav.myProfile}</h1>
      <Card>
        <CardHeader><CardTitle>{t.profile.accountDetails}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><span className="text-muted-foreground text-sm">{t.profile.name}</span><p className="font-medium">{user?.name}</p></div>
          <div><span className="text-muted-foreground text-sm">{t.profile.email}</span><p className="font-medium">{user?.email}</p></div>
          <div><span className="text-muted-foreground text-sm">{t.profile.role}</span><p className="font-medium capitalize">{user?.role}</p></div>
          <Button variant="destructive" className="w-full mt-4" onClick={logout}>{t.nav.signOut}</Button>
        </CardContent>
      </Card>
    </div>
  )
}

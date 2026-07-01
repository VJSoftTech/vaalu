import { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import { announcementService } from '@/services/announcementService'

const POLL_INTERVAL = 60_000

export function useAnnouncements() {
  const { isAuthenticated, user } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState(0)

  const refresh = useCallback(() => {
    if (!isAuthenticated || !user) { setUnreadCount(0); return }
    announcementService.getUnreadCount(user.id).then(setUnreadCount).catch(() => {})
  }, [isAuthenticated, user])

  useEffect(() => {
    refresh()
    if (!isAuthenticated) return
    const interval = setInterval(refresh, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [refresh, isAuthenticated])

  const markAllRead = useCallback(async () => {
    if (!user) return
    await announcementService.markAllRead(user.id)
    setUnreadCount(0)
  }, [user])

  return { unreadCount, refresh, markAllRead }
}

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { visitorService } from '@/services/visitorService'
import { getSessionId } from '@/utils/session'
import { getPageName } from '@/utils/pageLabels'

export function useVisitorTracking() {
  const location = useLocation()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const page_url = location.pathname + location.search
    visitorService
      .track({
        session_id: getSessionId(),
        user_id: user.id,
        user_name: user.name,
        email: user.email,
        page_name: getPageName(location.pathname),
        page_url,
      })
      .catch(() => {})
  }, [location.pathname, location.search, isAuthenticated, user])
}

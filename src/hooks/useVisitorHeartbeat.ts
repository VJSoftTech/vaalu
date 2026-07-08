import { useEffect } from 'react'
import { useAuthStore } from '@/store'
import { visitorService } from '@/services/visitorService'
import { getSessionId } from '@/utils/session'

const HEARTBEAT_INTERVAL_MS = 25000

export function useVisitorHeartbeat() {
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    const send = () => visitorService.heartbeat(getSessionId()).catch(() => {})
    const timer = setInterval(send, HEARTBEAT_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [isAuthenticated])
}

import { useEffect, useRef } from 'react'
import { API_BASE_URL } from '@/utils/constants'

export interface VisitorSocketEvent {
  type: 'visit' | 'heartbeat' | 'logout' | 'stats'
  payload: unknown
}

const getWsUrl = () => {
  const base = API_BASE_URL || window.location.origin
  return base.replace(/^http/, 'ws')
}

// Opens a WebSocket for live visitor-tracking events with exponential-backoff
// reconnect. Consumers get a debounced-refetch signal on any message rather
// than trying to reconcile partial payloads with the server's derived state.
export function useVisitorSocket(onEvent: (event: VisitorSocketEvent) => void) {
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let attempt = 0
    let closedByCleanup = false

    const connect = () => {
      ws = new WebSocket(getWsUrl())

      ws.onopen = () => {
        attempt = 0
      }
      ws.onmessage = (e) => {
        try {
          onEventRef.current(JSON.parse(e.data))
        } catch {
          /* ignore malformed message */
        }
      }
      ws.onclose = () => {
        if (closedByCleanup) return
        const delay = Math.min(30000, 1000 * 2 ** attempt)
        attempt += 1
        reconnectTimer = setTimeout(connect, delay)
      }
      ws.onerror = () => ws?.close()
    }

    connect()

    return () => {
      closedByCleanup = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [])
}

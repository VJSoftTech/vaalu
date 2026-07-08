const SESSION_KEY = 'vpms_session_id'

export const getSessionId = (): string => {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// Guest session id, persisted so a guest cart survives refreshes.
function getSessionId(): string {
  let sid = localStorage.getItem('tx_session_id')
  if (!sid) {
    sid = crypto.randomUUID()
    localStorage.setItem('tx_session_id', sid)
  }
  return sid
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tx_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['X-Session-Id'] = getSessionId()
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tx_token')
    }
    return Promise.reject(err)
  }
)

export function apiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback
  }
  return fallback
}

export { getSessionId }

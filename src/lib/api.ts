import { clearToken, getStoredToken, UNAUTHORIZED_EVENT } from '@/lib/session'
import type { ApiErrorBody } from '@/types/api'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number
  readonly details: string[]

  constructor(message: string, status: number, details: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export function normalizeApiError(body: ApiErrorBody | null, status: number) {
  const messages = Array.isArray(body?.message)
    ? body.message
    : body?.message
      ? [body.message]
      : []
  const fallback = body?.error || `Request failed with status ${status}`
  return new ApiError(messages[0] || fallback, status, messages)
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getStoredToken()
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiError(
      'Unable to reach the API. Check that the backend is running.',
      0,
    )
  }

  if (response.status === 401 && token) {
    clearToken()
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }

  const body =
    response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok)
    throw normalizeApiError(body as ApiErrorBody | null, response.status)
  return body as T
}

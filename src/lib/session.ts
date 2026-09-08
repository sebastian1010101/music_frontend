const TOKEN_KEY = 'music_catalog_token'
export const UNAUTHORIZED_EVENT = 'music-catalog:unauthorized'

type JwtPayload = {
  sub?: string
  email?: string
  exp?: number
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(normalized)) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenValid(token: string): boolean {
  const payload = decodeToken(token)
  return Boolean(payload?.exp && payload.exp * 1000 > Date.now())
}

export function getStoredToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (!token) return null
  if (isTokenValid(token)) return token
  sessionStorage.removeItem(TOKEN_KEY)
  return null
}

export function storeToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

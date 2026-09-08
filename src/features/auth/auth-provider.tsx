import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AuthContext } from '@/features/auth/use-auth'
import {
  clearToken,
  decodeToken,
  getStoredToken,
  storeToken,
  UNAUTHORIZED_EVENT,
} from '@/lib/session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  const signOut = useCallback(() => {
    clearToken()
    setToken(null)
  }, [])

  const signIn = useCallback((nextToken: string) => {
    storeToken(nextToken)
    setToken(nextToken)
  }, [])

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, signOut)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, signOut)
  }, [signOut])

  useEffect(() => {
    if (!token) return
    const payload = decodeToken(token)
    const delay = payload?.exp ? payload.exp * 1000 - Date.now() : 0
    if (delay <= 0) {
      signOut()
      return
    }
    const timeout = window.setTimeout(signOut, delay)
    return () => window.clearTimeout(timeout)
  }, [token, signOut])

  const value = useMemo(
    () => ({
      token,
      email: token ? decodeToken(token)?.email || null : null,
      signIn,
      signOut,
    }),
    [token, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

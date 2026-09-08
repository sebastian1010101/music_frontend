import { createContext, useContext } from 'react'

export type AuthContextValue = {
  token: string | null
  email: string | null
  signIn: (token: string) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}

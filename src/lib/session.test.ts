import {
  clearToken,
  decodeToken,
  getStoredToken,
  isTokenValid,
  storeToken,
} from '@/lib/session'

function token(payload: object) {
  return `header.${btoa(JSON.stringify(payload))}.signature`
}

describe('session token handling', () => {
  beforeEach(() => sessionStorage.clear())

  it('decodes and persists a valid JWT for the browser session', () => {
    const value = token({
      email: 'manager@example.com',
      exp: Math.floor(Date.now() / 1000) + 60,
    })
    storeToken(value)

    expect(isTokenValid(value)).toBe(true)
    expect(getStoredToken()).toBe(value)
    expect(decodeToken(value)?.email).toBe('manager@example.com')
  })

  it('clears expired or malformed tokens', () => {
    const expired = token({ exp: Math.floor(Date.now() / 1000) - 1 })
    storeToken(expired)
    expect(getStoredToken()).toBeNull()

    storeToken('not-a-token')
    expect(getStoredToken()).toBeNull()
  })

  it('removes the active token on logout', () => {
    const value = token({ exp: Math.floor(Date.now() / 1000) + 60 })
    storeToken(value)
    clearToken()
    expect(getStoredToken()).toBeNull()
  })
})

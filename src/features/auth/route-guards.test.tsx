import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/auth-provider'
import { ProtectedRoute } from '@/features/auth/route-guards'
import { storeToken } from '@/lib/session'

function token() {
  return `header.${btoa(JSON.stringify({ email: 'manager@example.com', exp: Math.floor(Date.now() / 1000) + 60 }))}.signature`
}

function renderRoutes() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>Login screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Private dashboard</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('protected routing', () => {
  beforeEach(() => sessionStorage.clear())

  it('redirects anonymous visitors to login', () => {
    renderRoutes()
    expect(screen.getByText('Login screen')).toBeInTheDocument()
  })

  it('renders protected pages with a valid session token', () => {
    storeToken(token())
    renderRoutes()
    expect(screen.getByText('Private dashboard')).toBeInTheDocument()
  })
})

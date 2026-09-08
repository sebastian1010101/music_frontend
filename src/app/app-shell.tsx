import {
  BarChart3,
  LogOut,
  Menu,
  Music2,
  PanelLeftClose,
  UsersRound,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth/use-auth'
import { cn } from '@/lib/utils'

const navigation = [
  { to: '/dashboard', label: 'Overview', icon: BarChart3 },
  { to: '/bands', label: 'Bands', icon: UsersRound },
  { to: '/tracks', label: 'Tracks', icon: Music2 },
]

const pageNames: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Catalog overview',
    subtitle: 'A clear view of your music collection.',
  },
  '/bands': {
    title: 'Bands',
    subtitle: 'Manage the artists behind your catalog.',
  },
  '/tracks': {
    title: 'Tracks',
    subtitle: 'Organize every track and its details.',
  },
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const { email, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const page = pageNames[location.pathname] || pageNames['/dashboard']

  const logout = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className={cn('app-frame', compact && 'sidebar-compact')}>
      {mobileOpen && (
        <button
          className="mobile-scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={cn('sidebar', mobileOpen && 'sidebar-open')}>
        <div className="sidebar-brand">
          <NavLink
            to="/dashboard"
            className="brand"
            onClick={() => setMobileOpen(false)}
          >
            <span className="brand-mark">
              <Music2 />
            </span>
            <span className="brand-name">Resonance</span>
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </Button>
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn('nav-link', isActive && 'nav-link-active')
              }
              title={compact ? label : undefined}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-account">
          <div className="account-avatar">
            {email?.[0]?.toUpperCase() || 'M'}
          </div>
          <div className="account-copy">
            <strong>Catalog Manager</strong>
            <span>{email}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={17} />
          </Button>
        </div>
        <button
          className="sidebar-collapse"
          onClick={() => setCompact((value) => !value)}
          aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeftClose size={17} />
          <span>Collapse sidebar</span>
        </button>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <Button
            variant="ghost"
            size="icon"
            className="menu-button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </Button>
          <div className="page-heading">
            <h1>{page.title}</h1>
            <p>{page.subtitle}</p>
          </div>
          <div className="status-pill">
            <span /> API connected
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/app-shell'
import { NotFoundPage } from '@/app/not-found'
import { LoginPage, RegisterPage } from '@/features/auth/auth-page'
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth/route-guards'
import { BandsPage } from '@/features/bands/bands-page'
import { DashboardPage } from '@/features/dashboard/dashboard-page'
import { TracksPage } from '@/features/tracks/tracks-page'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bands" element={<BandsPage />} />
          <Route path="/tracks" element={<TracksPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

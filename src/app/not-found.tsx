import { ArrowLeft, Music2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="brand-mark">
        <Music2 />
      </span>
      <p className="eyebrow">404 · Page not found</p>
      <h1>This page is off the record.</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/dashboard" className="button button-primary button-md">
        <ArrowLeft size={17} /> Back to dashboard
      </Link>
    </main>
  )
}

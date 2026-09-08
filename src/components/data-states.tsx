import { CircleAlert, RefreshCw } from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import { getErrorMessage } from '@/lib/utils'

export function LoadingPanel({
  label = 'Loading catalog',
}: {
  label?: string
}) {
  return (
    <div className="loading-panel" role="status">
      <Spinner />
      <span>{label}…</span>
    </div>
  )
}

export function ErrorPanel({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  return (
    <div className="error-panel" role="alert">
      <CircleAlert size={22} />
      <div>
        <strong>We couldn’t load this page</strong>
        <p>{getErrorMessage(error)}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={retry}>
        <RefreshCw size={15} /> Retry
      </Button>
    </div>
  )
}

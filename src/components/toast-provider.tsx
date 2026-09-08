import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastContext, type ToastTone } from '@/components/toast-context'

type Toast = { id: number; message: string; tone: ToastTone }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])
  const notify = useCallback(
    (message: string, tone: Toast['tone'] = 'success') => {
      const id = Date.now()
      setToasts((current) => [...current, { id, message, tone }])
      window.setTimeout(() => dismiss(id), 4500)
    },
    [dismiss],
  )
  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="toast-region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.tone}`} key={toast.id}>
            {toast.tone === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <CircleAlert size={18} />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

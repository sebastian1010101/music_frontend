import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Dialog from '@radix-ui/react-dialog'
import { LoaderCircle, Search, X } from 'lucide-react'
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'icon'
}) {
  return (
    <button
      className={cn('button', `button-${variant}`, `button-${size}`, className)}
      {...props}
    />
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircle className={cn('spinner', className)} aria-hidden="true" />
  )
}

export function TextField({
  label,
  error,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}) {
  const id = props.id || props.name
  const descriptionId = `${id}-description`
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <input
        className={cn('input', error && 'input-error')}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        {...props}
      />
      {(error || hint) && (
        <span
          id={descriptionId}
          className={cn('field-hint', error && 'field-error')}
        >
          {error || hint}
        </span>
      )}
    </label>
  )
}

export function SelectField({
  label,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  children: ReactNode
}) {
  const id = props.id || props.name
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <select
        className={cn('input', error && 'input-error')}
        id={id}
        {...props}
      >
        {children}
      </select>
      {error && <span className="field-hint field-error">{error}</span>}
    </label>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="search-field">
      <Search size={17} aria-hidden="true" />
      <span className="sr-only">Search</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </label>
  )
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-header">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>{description}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close dialog">
                <X size={18} />
              </Button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  pending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  pending?: boolean
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog-overlay" />
        <AlertDialog.Content className="dialog-content dialog-alert">
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
          <div className="dialog-actions">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={pending}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <Button variant="danger" onClick={onConfirm} disabled={pending}>
              {pending && <Spinner />} {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export function PageState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="page-state">
      <div className="page-state-icon">♪</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  )
}

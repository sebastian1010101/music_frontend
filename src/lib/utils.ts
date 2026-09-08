import { clsx, type ClassValue } from 'clsx'

export function cn(...values: ClassValue[]) {
  return clsx(values)
}

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0)
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong'
}

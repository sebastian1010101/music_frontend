export type User = {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export type Band = {
  id: string
  name: string
  formatYear: number
}

export type Track = {
  id: string
  title: string
  length: number
  bandId: string
}

export type LoginInput = { email: string; password: string }
export type RegisterInput = LoginInput & { username: string }
export type AuthResponse = { token: string }
export type BandInput = Omit<Band, 'id'>
export type BandUpdate = Partial<BandInput>
export type TrackInput = Omit<Track, 'id'>
export type TrackUpdate = Partial<TrackInput>

export type ApiErrorBody = {
  statusCode?: number
  message?: string | string[]
  error?: string
}
